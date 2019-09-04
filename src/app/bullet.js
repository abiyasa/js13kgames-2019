import { Sprite } from 'kontra';
import { Base} from './base';

export class Bullet extends Base {
  constructor(props = {}) {
    super();
    this.sprite = Sprite(props);
  }

  init(props) {
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

  isAlive() {
    return this.sprite.isAlive();
  }

  update(dt) {
    const { sprite } = this;

    if ((sprite.x > sprite.context.canvas.width) || (sprite.x < 0)) {
      sprite.ttl = 0;
    }

    super.update(dt);
  }
}
