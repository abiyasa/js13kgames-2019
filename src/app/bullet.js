import { Base} from './base';

export const TYPE_BULLET_HERO = 100;
export const TYPE_BULLET_ENEMY = 101;

export class Bullet extends Base {
  init(props = {}) {
    const baseCfg = {
      color: 'blue',
      width: 8,
      height: 8,
      radius: 4,
    }

    super.init({
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
