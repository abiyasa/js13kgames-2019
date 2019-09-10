import { init, initPointer, initKeys, GameLoop, Pool, Quadtree } from 'kontra';
import { Hero, TYPE_HERO } from './hero';
import { CrossHair } from './crosshair';
import { Enemy, TYPE_ENEMY_SIMPLE } from './enemy';
import { Bullet, TYPE_BULLET_HERO, TYPE_BULLET_ENEMY } from './bullet';
import { getRandomNumber, createCanvasFromSVG } from './utils';
import heroAsset from './hero.svg';

const EVENT_TYPE_ADD_ENEMY = 1;
const EVENT_TYPE_GAME_OVER = 50;

const GAME_STATE_INIT = 10;
const GAME_STATE_START = 20;
const GAME_STATE_PAUSED = 30;
const GAME_STATE_GAME_OVER = 40;

async function initAssets() {
  const hero = await createCanvasFromSVG(heroAsset, 20, 40);

  return {
    hero
  };
}

export const GameEngine = {
  async init(props = {}) {
    init();
    initKeys();
    initPointer();
    const asset = await initAssets();

    this.hero = new Hero();
    this.hero.init({ x: 160, y: 360, hp: 3, image: asset.hero });
    this.crosshair = new CrossHair();
    this.crosshair.init();

    this.poolEnemies = Pool({ create: props => new Enemy(props) });
    this.poolBullets = Pool({ create: props => new Bullet(props) });

    this.quadtree = Quadtree();
    this.eventQueue = [];

    this.gameUI = props.gameUI;

    this._gameState = GAME_STATE_INIT;
    this._gameScore = 0;

    this.gameloop = GameLoop({
      update: () => this.update(),
      render: () => this.render(),
    });
  },

  start() {
    this.gameloop.start();
    this._gameState = GAME_STATE_START;
  },

  pause() {
    const isStopped = this.gameloop.isStopped;
    if (isStopped) {
      this.gameloop.start();
      this._gameState = GAME_STATE_START;
    } else {
      this.gameloop.stop();
      this._gameState = GAME_STATE_PAUSED;
    }

    return isStopped;
  },

  isGameOver() {
    return this._gameState === GAME_STATE_GAME_OVER;
  },

  update() {
    const { crosshair, hero, poolBullets, poolEnemies } = this;

    this.updateEventQueue();
    this.controlEnemiesPopulation();

    crosshair.update();
    hero.update();

    if (crosshair.canFire() && hero.isHittable()) {
      crosshair.fire(poolBullets, hero.x, hero.y);
    }

    this.handleCollisionDetection();

    poolBullets.update();
    poolEnemies.update();
  },

  render() {
    this.poolEnemies.render();
    this.hero.render();
    this.crosshair.render();
    this.poolBullets.render();

    this.renderUI();
  },

  renderUI() {
    const { labelHeroHp, labelScore } = this.gameUI;

    labelHeroHp.textContent = `♡ ${this.hero.hp}`;
    labelScore.textContent = this._gameScore;
  },

  updateEventQueue() {
    const { eventQueue } = this;

    if (eventQueue.length === 0) return;

    const nextEvent = eventQueue[0];
    if (nextEvent.delay > 0) {
      nextEvent.delay--;
      return;
    }

    // process event
    const event = eventQueue.shift();
    switch (event.type) {
      case EVENT_TYPE_GAME_OVER:
        this._gameState = GAME_STATE_GAME_OVER;
        this.gameloop.stop();

        // notify game over
        const event = new Event('gameOver');
        document.dispatchEvent(event);
        break;

      case EVENT_TYPE_ADD_ENEMY:
      default:
        this.generateEnemies();
    }
  },

  controlEnemiesPopulation() {
    const aliveEnemiesCount = this.poolEnemies.getAliveObjects().length;
    const futureEnemiesCount = this.eventQueue.filter(e => e.type === EVENT_TYPE_ADD_ENEMY).length;
    const totalEnemiesCount = aliveEnemiesCount + futureEnemiesCount;

    if (totalEnemiesCount < 8) {
      const numToGenerate = 8 - totalEnemiesCount;

      for (let _ = 0; _ < numToGenerate; _++) {
        console.log(`adding ${numToGenerate} enemies`);

        this.eventQueue.push({
          type: EVENT_TYPE_ADD_ENEMY,
          delay: getRandomNumber(0, 80)
        });
      }
    }
  },

  generateEnemies() {
    // TODO: check level & generate behaviour
    this.poolEnemies.get({
      hero: this.hero,
      poolBullets: this.poolBullets,
      behaviour: 0
    });
  },

  handleCollisionDetection() {
    const { hero, poolBullets, poolEnemies, quadtree } = this;
    const bullets = poolBullets.getAliveObjects();
    const enemies = poolEnemies.getAliveObjects();

    quadtree.clear();
    quadtree.add(hero, bullets, enemies);

    bullets.forEach(bullet => {
      if (!bullet.isAlive()) return;

      const nodeItems = quadtree.get(bullet);

      switch (bullet.type) {
        case TYPE_BULLET_HERO:
          this.checkHeroBulletAgainstItems(bullet, nodeItems);
          break;

        case TYPE_BULLET_ENEMY:
          this.checkHeroHitItem(hero, bullet);
          break;
      }
    });

    enemies.forEach(enemy => {
      if (!enemy.isAlive()) return;

      this.checkHeroHitItem(hero, enemy);
    });
  },

  checkHeroBulletAgainstItems(bullet, items) {
    items.every(item => {
      if (!item.isAlive()) return true;

      if (item.type === TYPE_ENEMY_SIMPLE) {
        if (item.collidesWith(bullet)) {
          // remove both
          item.kill();
          bullet.kill();

          this._gameScore += 10;

          // short-circuit loop
          return false;
        }
      }

      return true;
    });
  },

  checkHeroHitItem(hero, item) {
    if (hero.isHittable() && hero.collidesWith(item)) {
      item.kill();
      hero.getHit(item);

      if (hero.hp <= 0) {
        // game over with high priority
        this.eventQueue.unshift({
          type: EVENT_TYPE_GAME_OVER,
          delay: 30
        });
      }
    }
  },
};
