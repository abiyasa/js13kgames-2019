import { init, initPointer, GameLoop } from 'kontra';
import { Hero } from './hero';
import { CrossHair } from './crosshair';
import { Enemy } from './enemy';

export const GameEngine = {
  init() {
    init();
    initPointer();

    const enemies = [
      new Enemy({ color: '#FF8080', x: 320, y: 10 }),
      new Enemy({ color: '#80FF80', x: 160, y: 60 }),
      new Enemy({ color: '#8080FF', x: 480, y: 150 }),
    ]
    const hero = new Hero({ x: 160, y: 360 });
    const crosshair = new CrossHair();

    GameLoop({
      update() {
        crosshair.update();
        hero.update();
        enemies.forEach(enemy => enemy.update());
      },

      render() {
        hero.render();
        enemies.forEach(enemy => enemy.render());
        crosshair.render();
      }
    }).start();
  }
};
