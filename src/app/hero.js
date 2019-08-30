import { Sprite } from 'kontra';
import { Base} from './base';

export class Hero extends Base {
  init(props = {}) {
    const heroCfg = {
      color: 'red',
      width: 20,
      height: 40,
    }

    this.sprite = Sprite({
      x: 100,
      y: 80,
      dx: 2,
      ...heroCfg,
      ...props
    });
  }

  update(dt) {
    const { sprite } = this;

    if (sprite.x + sprite.width > sprite.context.canvas.width) {
      sprite.dx = -sprite.dx;
    }
    if (sprite.x < 0) {
      sprite.dx = -sprite.dx;
    }

    sprite.update(dt);
  }
}
