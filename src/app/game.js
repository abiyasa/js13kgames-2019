import { init, initPointer, GameLoop } from 'kontra';
import { Hero } from './hero';
import { CrossHair } from './crosshair';

export const GameEngine = {
  init() {
    init();
    initPointer();

    const hero = new Hero();
    hero.init();
    const crosshair = new CrossHair();
    crosshair.init();

    GameLoop({
      update() {
        hero.update();
        crosshair.update();
      },

      render() {
        hero.render();
        crosshair.render();
      }
    }).start();
  }
};
