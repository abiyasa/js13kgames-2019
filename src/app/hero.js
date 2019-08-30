import { Sprite } from 'kontra';
import { Base} from './base';

export class Hero extends Base {
  constructor(props = {}) {
    super();

    const baseCfg = {
      color: 'red',
      width: 20,
      height: 40,
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

    sprite.update(dt);
  }
}
