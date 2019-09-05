import { Sprite } from 'kontra';
import { Base} from './base';

export const BULLET_HERO = 0;
export const BULLET_ENEMY = 1;

export class Bullet extends Base {
  constructor(props = {}) {
    super();
    this.sprite = Sprite(props);
  }

  init(props = {}) {
    this.type = props.type;

    const baseCfg = {
      anchor: { x: 0.5, y: 0.5 },
      color: 'blue',
      width: 8,
      height: 8,
      radius: 4,
    }

    this.sprite.init({
      ...baseCfg,
      ...props
    });
  }

  update(dt) {
    const { sprite } = this;

    if ((sprite.x > sprite.context.canvas.width) || (sprite.x < 0)) {
      sprite.ttl = 0;
    }

    super.update(dt);
  }
}