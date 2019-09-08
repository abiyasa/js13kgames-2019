import { track, pointer } from 'kontra';
import { Base} from './base';
import { TYPE_BULLET_HERO } from './bullet';

export class CrossHair extends Base {
  init(props = {}) {
    this._isTriggered = false;
    this._fireDelayer = 0;

    super.init({
      color: 'blue',
      width: 20,
      height: 20,
      radius: 10,
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

  fire(poolBullets, fromX, fromY) {
    this._fireDelayer = 20;

    // calculate bullet shooting direction
    const { x: toX, y: toY } = this.sprite;
    // console.log(`firing from (${fromX},${fromY}) to (${toX},${toY})`);
    const displacement = { x: toX - fromX, y: toY - fromY };
    const distance = Math.sqrt((displacement.x ** 2) + (displacement.y ** 2));

    // add bullet
    poolBullets.get({
      type: TYPE_BULLET_HERO,
      x: fromX,
      y: fromY,
      dx: displacement.x / distance * 10,
      dy: displacement.y / distance * 10,
      color: 'cyan',
      ttl: 60
    });
  }

  _setTrigger(val) {
    this._isTriggered = val;
  }
}
