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

    const enemies = [
      new Enemy({ color: '#FF8080', x: 320, y: 10 }),
      new Enemy({ color: '#80FF80', x: 160, y: 60 }),
      new Enemy({ color: '#8080FF', x: 480, y: 150 }),
    ]
    const hero = new Hero({ x: 160, y: 360 });
    const crosshair = new CrossHair();
    const bulletPool = Pool({
      create: (props) => new Bullet(props)
    });

    GameLoop({
      update() {
        crosshair.update();
        hero.update();

        if (crosshair.canFire()) {
          crosshair.fire();

          // add bullet
          bulletPool.get({
            x: crosshair.sprite.x,
            y: crosshair.sprite.y,
            color: 'magenta',
            ttl: 60
          });
        }

        bulletPool.update();
        enemies.forEach(enemy => enemy.update());
      },

      render() {
        hero.render();
        enemies.forEach(enemy => enemy.render());
        crosshair.render();
        bulletPool.render();
      }
    }).start();
  }
};
