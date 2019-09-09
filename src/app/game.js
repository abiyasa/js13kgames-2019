import { init, initPointer, initKeys, GameLoop, Pool, Quadtree } from 'kontra';
import { Hero, TYPE_HERO } from './hero';
import { CrossHair } from './crosshair';
import { Enemy, TYPE_ENEMY_SIMPLE } from './enemy';
import { Bullet, TYPE_BULLET_HERO, TYPE_BULLET_ENEMY } from './bullet';
import { getRandomNumber } from './utils';

const EVENT_TYPE_ADD_ENEMY = 1;

export const GameEngine = {
  init(props = {}) {
    init();
    initKeys();
    initPointer();

    this.hero = new Hero();
    this.hero.init({ x: 160, y: 360, hp: 3 });
    this.crosshair = new CrossHair();
    this.crosshair.init();

    this.poolEnemies = Pool({ create: props => new Enemy(props) });
    this.poolBullets = Pool({ create: props => new Bullet(props) });

    this.quadtree = Quadtree();
    this.eventQueue = [];

    this.gameUI = props.gameUI;

    this.gameloop = GameLoop({
      update: () => this.update(),
      render: () => this.render(),
    });
  },

  start() {
    this.gameloop.start();
  },

  pause() {
    const isStopped = this.gameloop.isStopped;
    if (isStopped) {
      this.gameloop.start();
    } else {
      this.gameloop.stop();
    }

    return isStopped;
  },

  update() {
    const { crosshair, hero, poolBullets, poolEnemies } = this;

    this.updateEventQueue();
    this.controlEnemiesPopulation();

    crosshair.update();
    hero.update();

    if (crosshair.canFire()) {
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
    const { labelHeroHp } = this.gameUI;

    console.log('rendering ', this.hero.hp);
    labelHeroHp.textContent = this.hero.hp;
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
          this.checkEnemyBulletAgainstHero(hero, bullet);
          break;
      }
    });

    // TODO: check hit between enemies & hero
  },

  checkHeroBulletAgainstItems(bullet, items) {
    items.every(item => {
      if (!item.isAlive()) return true;

      if (item.type === TYPE_ENEMY_SIMPLE) {
        if (item.collidesWith(bullet)) {
          // remove both item
          item.kill();
          bullet.kill();

          // TODO: add to hero score

          // short-circuit loop
          return false;
        }
      }

      return true;
    });
  },

  checkEnemyBulletAgainstHero(hero, bullet) {
    if (hero.isHittable() && hero.collidesWith(bullet)) {
      bullet.kill();
      hero.getHit(bullet);

      // TODO: check hero hp
    }
  }
};
