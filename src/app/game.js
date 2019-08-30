import { init, GameLoop, Sprite } from 'kontra';
import { Hero } from './hero';

export const GameEngine = {
  init() {
    const { canvas } = init();

    const hero = new Hero();
    hero.init({ canvas });

    this._loop = GameLoop({
      update() {
        hero.update();
      },

      render() {
        hero.render();
      }
    });
  },

  start() {
    this._loop.start();
  }
};
