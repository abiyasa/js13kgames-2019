import { init, initPointer, initKeys, GameLoop, Pool } from 'kontra';
import { Hero } from './hero';
import { CrossHair } from './crosshair';
import { Enemy } from './enemy';
import { Bullet } from './bullet';

export const GameEngine = {
  init() {
    init();
    initKeys();
    initPointer();

    this.enemies = [
      new Enemy({ color: '#FF8080', x: 320, y: 10 }),
      new Enemy({ color: '#80FF80', x: 160, y: 60 }),
      new Enemy({ color: '#8080FF', x: 480, y: 150 }),
    ]
    this.hero = new Hero({ x: 160, y: 360 });
    this.crosshair = new CrossHair();
    this.bulletPool = Pool({
      create: (props) => new Bullet(props)
    });

    GameLoop({
      update: () => this.update(),
      render: () => this.render(),
    }).start();
  },

  update() {
    const { crosshair, hero, bulletPool, enemies } = this;

    crosshair.update();
    hero.update();

    if (crosshair.canFire()) {
      this.shoot();
    }

    bulletPool.update();
    enemies.forEach(enemy => enemy.update());
  },

  render() {
    this.hero.render();
    this.enemies.forEach(enemy => enemy.render());
    this.crosshair.render();
    this.bulletPool.render();
  },

  shoot() {
    const { crosshair, hero, bulletPool } = this;
    const { x: targetX, y: targetY } = crosshair.sprite;
    const { x: sourceX, y: sourceY } = hero.sprite;

    crosshair.fire();

    // calculate bullet shooting direction
    const displacement = { x: targetX - sourceX, y: targetY - sourceY };
    const distance = Math.sqrt((displacement.x ** 2) + (displacement.y ** 2));

    // add bullet
    bulletPool.get({
      x: sourceX,
      y: sourceY,
      dx: displacement.x / distance * 10,
      dy: displacement.y / distance * 10,
      color: 'magenta',
      ttl: 60
    });
  }

};
