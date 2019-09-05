import { Base} from './base';

export const TYPE_ENEMY_SIMPLE = 200;

export class Enemy extends Base {
  init(props = {}) {
    this.type = props.type;

    const baseCfg = {
      color: 'black',
      anchor: { x: 0.5, y: 0.5 },
      width: 20,
      height: 40,
      radius: 10,
    }

    super.init({
      ...baseCfg,
      ...props
    });
  }

  update(dt) {
    const { sprite } = this;

    if (sprite.x + sprite.radius > sprite.context.canvas.width) {
      sprite.dx = -sprite.dx;
    }
    if (sprite.x - sprite.radius < 0) {
      sprite.dx = -sprite.dx;
    }

    super.update(dt);
  }
}
