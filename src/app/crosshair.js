import { Sprite, track, pointer } from 'kontra';
import { Base} from './base';

export class CrossHair extends Base {
  init(props = {}) {
    this._isTriggered = false;
    this._fireDelayer = 0;

    super.init({
      color: 'blue',
      width: 20,
      height: 20,
      radius: 10,
      anchor: { x: 0.5, y: 0.5 },
      onUp: () => this._setTrigger(false),
      onDown: () => this._setTrigger(true),
      ...props
    });

    track(this.sprite);
  }

  update(dt) {
    const { sprite } = this;

    sprite.x = pointer.x;
    sprite.y = pointer.y;

    if (this._fireDelayer > 0) {
      this._fireDelayer--;
    }

    super.update(dt);
  }

  canFire() {
    return this._isTriggered && (this._fireDelayer == 0);
  }

  fire() {
    this._fireDelayer = 10;
  }

  _setTrigger(val) {
    this._isTriggered = val;
  }
}
