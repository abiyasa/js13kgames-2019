import { init, initPointer, initKeys, GameLoop, Pool, Quadtree } from 'kontra';
import { Hero, TYPE_HERO } from './hero';
import { CrossHair } from './crosshair';
import { Enemy, TYPE_ENEMY_SIMPLE } from './enemy';
import { Bullet, TYPE_BULLET_HERO, TYPE_BULLET_ENEMY } from './bullet';

export const GameEngine = {
  init() {
    init();
    initKeys();
    initPointer();

    this.hero = new Hero();
    this.hero.init({ x: 160, y: 360 });
    this.crosshair = new CrossHair();
    this.crosshair.init();

    this.poolEnemies = Pool({
      create: (props) => new Enemy(props)
    });
    this.poolBullets = Pool({
      create: (props) => new Bullet(props)
    });

    this.quadtree = Quadtree();

    GameLoop({
      update: () => this.update(),
      render: () => this.render(),
    }).start();
  },

  update() {
    const { crosshair, hero, poolBullets, poolEnemies } = this;

    this.controlEnemiesPopulation();

    crosshair.update();
    hero.update();

    if (crosshair.canFire()) {
      this.heroFire();
    }

    this.handleCollisionDetection();

    poolBullets.update();
    poolEnemies.update();
  },

  render() {
    this.hero.render();
    this.poolEnemies.render();
    this.crosshair.render();
    this.poolBullets.render();
  },

  heroFire() {
    const { crosshair, hero, poolBullets } = this;
    const { x: targetX, y: targetY } = crosshair.sprite;
    const { x: sourceX, y: sourceY } = hero.sprite;

    crosshair.fire();

    // calculate bullet shooting direction
    const displacement = { x: targetX - sourceX, y: targetY - sourceY };
    const distance = Math.sqrt((displacement.x ** 2) + (displacement.y ** 2));

    // add bullet
    poolBullets.get({
      type: TYPE_BULLET_HERO,
      x: sourceX,
      y: sourceY,
      dx: displacement.x / distance * 10,
      dy: displacement.y / distance * 10,
      color: 'magenta',
      ttl: 60
    });
  },

  controlEnemiesPopulation() {
    const enemies = this.poolEnemies.getAliveObjects();
    if (enemies.length < 8) {
      const numToGenerate = 8 - enemies.length;

      // TODO: add delayer
      for (let _ = 0; _ < numToGenerate; _++) {
        this.generateEnemies();
      }
    }
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
      const bulletType = bullet.type;

      if (bulletType === TYPE_BULLET_HERO) {
        this.checkHeroBulletAgainstItems(bullet, nodeItems);
      }
    });
  },

  checkHeroBulletAgainstItems(bullet, items) {
    items.forEach(item => {
      if (!item.isAlive()) return;

      if (item.type === TYPE_ENEMY_SIMPLE) {
        if (item.collidesWith(bullet)) {
          // remove item
          item.kill();

          // TODO: score
        }
      }
    });
  },

  generateEnemies() {
    const { random, floor } = Math;
    const randColor = floor(random() * 255).toString(16);
    this.poolEnemies.get({
      type: TYPE_ENEMY_SIMPLE,
      color: `#${randColor}8080`,
      x: 160 + floor(random() * 320),
      y: 20 + floor(random() * 200),
      dx: 1 + floor(random() * 3),
      ttl: Infinity
    });
  }
};
