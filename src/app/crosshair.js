import { Sprite, track, pointer } from 'kontra';
import { Base} from './base';

export class CrossHair extends Base {
  constructor(props = {}) {
    super();

    this.sprite = Sprite({
      color: 'blue',
      width: 20,
      height: 20,
      radius: 10,
      ...props
    });

    track(this.sprite);
  }

  update(dt) {
    const { sprite } = this;

    sprite.x = pointer.x - sprite.radius;
    sprite.y = pointer.y - sprite.radius;

    sprite.update(dt);
  }

}
