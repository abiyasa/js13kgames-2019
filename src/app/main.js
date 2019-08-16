import { init, Sprite, GameLoop } from 'kontra';

const { canvas } = init();

const sprite = Sprite({
  x: 100,
  y: 80,
  color: 'red',
  width: 20,
  height: 40,
  dx: 2
});

const loop = GameLoop({
  update() {
    sprite.update();

    if (sprite.x > canvas.width) {
      sprite.x = -sprite.width;
    }
  },

  render() {
    sprite.render();
  }
});

loop.start();
