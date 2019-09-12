import { keyPressed } from 'kontra';
import { Base} from './base';

export const TYPE_HERO = 101;

export class Hero extends Base {
  init(props = {}) {
    const { hp, assets, ...restProps } = props;
    this.hp = hp;

    this._invisible = false;
    this._isGetHit = false;
    this._getHitFrame = 0;

    const image = generateImage(assets, 50, 40);

    const baseCfg = {
      type: TYPE_HERO,
      image,
      width: 50,
      height: 40,
      speed: 3,
      radius: 25,
    }

    super.init({
      x: 100,
      y: 80,
      ...baseCfg,
      ...restProps
    });
  }

  isHittable() {
    return !this._invisible;
  }

  getHit(item) {
    this.hp--;

    // set invisible for a moment
    this._invisible = true;
    this._isGetHit = true;
    this._getHitFrame = 150;  // time to recover from hit
  }

  update(dt) {
    const { sprite } = this;

    // move direction
    let direction;
    if (keyPressed('a') || keyPressed('left')) {
      direction = -1;
    }
    else if (keyPressed('d') || keyPressed('right')) {
      direction = 1;
    } else {
      direction = 0;
    }
    sprite.dx = direction * sprite.speed;

    // limit movement
    if (sprite.x + sprite.radius > sprite.context.canvas.width) {
      sprite.x = sprite.context.canvas.width - sprite.radius;
    }
    if (sprite.x - sprite.radius < 0) {
      sprite.x = sprite.radius;
    }

    // handle get hit animation
    if (this._isGetHit) {
      this._getHitFrame--;

      if (this._getHitFrame <= 0) {
        // recover from get hit
        this._invisible = false;
        this._isGetHit = false;
      }
    }

    super.update(dt);
  }

  render() {
    // blinking animation when get hit
    if (this._isGetHit && (this._getHitFrame % 10) <= 4) {
      return;
    }

    super.render();
  }
}

function generateImage(assets, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  ctx.drawImage(assets.leg01, 0, 0);
  ctx.drawImage(assets.hero, 0, 0);

  return canvas;
}
