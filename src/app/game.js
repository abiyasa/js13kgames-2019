import { init, initPointer, initKeys, GameLoop, Pool } from 'kontra';
import { Hero } from './hero';
import { CrossHair } from './crosshair';
import { Enemy } from './enemy';
import { Bullet, BULLET_HERO, BULLET_ENEMY } from './bullet';

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
    this.poolEnemies.get({ color: '#FF8080', x: 320, y: 10, dx: 2, ttl: Infinity });
    this.poolEnemies.get({ color: '#80FF80', x: 160, y: 60, dx: 4, ttl: Infinity });
    this.poolEnemies.get({ color: '#8080FF', x: 480, y: 150, dx: 2, ttl: Infinity });

    this.poolBullets = Pool({
      create: (props) => new Bullet(props)
    });

    GameLoop({
      update: () => this.update(),
      render: () => this.render(),
    }).start();
  },

  update() {
    const { crosshair, hero, poolBullets, poolEnemies } = this;

    crosshair.update();
    hero.update();

    if (crosshair.canFire()) {
      this.heroFire();
    }

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
      type: BULLET_HERO,
      x: sourceX,
      y: sourceY,
      dx: displacement.x / distance * 10,
      dy: displacement.y / distance * 10,
      color: 'magenta',
      ttl: 60
    });
  }

};
