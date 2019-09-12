import { track, pointer, SpriteSheet } from 'kontra';
import { Base} from './base';
import { TYPE_BULLET_HERO } from './bullet';

export class CrossHair extends Base {
  init(props = {}) {
    this._isTriggered = false;
    this._fireDelayer = 0;

    super.init({
      animations: this.initSpriteSheets().animations,
      width: 40,
      height: 40,
      radius: 20,
      onUp: () => this._setTrigger(false),
      onDown: () => this._setTrigger(true),
      ...props
    });

    track(this.sprite);
  }

  initSpriteSheets() {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-crosshair';
    canvas.width = 80;
    canvas.height = 40;

    const ctx = canvas.getContext('2d');
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';

    // ctx.fillRect(0, 0, canvas.width - 1, canvas.height - 1);
    ctx.fillText('☩', 19, 22);
    ctx.font = '45px serif';
    ctx.fillText('☩', 59, 23);

    return SpriteSheet({
      image: canvas,
      frameWidth: 40,
      frameHeight: 40,
      animations: {
        beat: {
          frames: '0..1',
          frameRate: 2
        }
      }
    });
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
      color: '#83D1C9',
      ttl: 60
    });
  }

  _setTrigger(val) {
    this._isTriggered = val;
  }
}
