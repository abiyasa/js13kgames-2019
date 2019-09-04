import { Sprite } from 'kontra';
import { Base} from './base';

export class Enemy extends Base {
  constructor(props = {}) {
    super();

    const baseCfg = {
      color: 'black',
      width: 20,
      height: 40,
      radius: 10,
    }

    this.sprite = Sprite({
      x: 100,
      y: 80,
      anchor: { x: 0.5, y: 0.5 },
      dx: 2,
      ...baseCfg,
      ...props
    });
  }

  update(dt) {
    const { sprite } = this;

    if (sprite.x + sprite.radius > sprite.context.canvas.width) {
      sprite.dx = -sprite.dx;
    }
    if (sprite.x - sprite.radius < 0) {
      sprite.dx = -sprite.dx;
    }

    super.update(dt);
  }
}
