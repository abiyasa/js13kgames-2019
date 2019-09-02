import { Sprite, keyPressed } from 'kontra';
import { Base} from './base';

export class Hero extends Base {
  constructor(props = {}) {
    super();

    const baseCfg = {
      color: 'red',
      width: 20,
      height: 40,
      speed: 3,
    }

    this.sprite = Sprite({
      x: 100,
      y: 80,
      ...baseCfg,
      ...props
    });
  }

  update(dt) {
    const { sprite } = this;

    // move direction
    let direction;
    if (keyPressed('a')) {
      // move left
      direction = -1;
    }
    else if (keyPressed('d')) {
      // move right
      direction = 1;
    } else {
      direction = 0;
    }
    sprite.dx = direction * sprite.speed;

    // limit movement
    if (sprite.x + sprite.width > sprite.context.canvas.width) {
      sprite.x = sprite.context.canvas.width - sprite.width;
    }
    if (sprite.x < 0) {
      sprite.x = 0;
    }

    sprite.update(dt);
  }
}
