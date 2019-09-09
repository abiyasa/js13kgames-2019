import { Base} from './base';
import { TYPE_BULLET_ENEMY } from './bullet';
import { getRandomNumber } from './utils';

export const TYPE_ENEMY_SIMPLE = 200;

// enemy behaviour
// - 0: straight from top to bottom, fire towards hero once randomly
// - chase slowly towards player
// - straight from top and then stop within distance (to fire)
// - straight from top and then stop within distance (to fire) for a delay, and then continue

// NOTE: shooting type
// - shoot every X secs towards player
// - shoot once
// - shoot with certain pattern direction
// - spread shoot

export class Enemy extends Base {
  init(props = {}) {
    const baseCfg = {
      ttl: Infinity,
      type: TYPE_ENEMY_SIMPLE,
      color: 'black',
      width: 20,
      height: 40,
      radius: 10,
    };

    this.behaviour = props.behaviour;

    super.init({
      ...baseCfg,
      ...getInitialCfg(this.behaviour),
      ...props
    });
  }

  update(dt) {
    const { sprite, behaviour } = this;
    const canvas = sprite.context.canvas;
    const posY = sprite.y;

    switch (behaviour) {
      case 0:
        if (posY + sprite.radius > canvas.height + 100) {
          this.kill();
        }

        if (sprite.shootDelay <= 0) {
          this.fire(sprite.poolBullets, sprite.hero.x, sprite.hero.y, 2);
          sprite.shootDelay = Infinity; // shoot only once
        } else {
          sprite.shootDelay--;
        }
        break;

      default:
        break;
    }

    super.update(dt);
  }

  fire(poolBullets, toX, toY, velocity = 10, ttl = Infinity) {
    this._fireDelayer = 20;

    // calculate bullet shooting direction
    const { x: fromX, y: fromY } = this.sprite;
    console.log(`firing from (${fromX},${fromY}) to (${toX},${toY})`);
    const displacement = { x: toX - fromX, y: toY - fromY };
    const distance = Math.sqrt((displacement.x ** 2) + (displacement.y ** 2));

    // add bullet
    poolBullets.get({
      type: TYPE_BULLET_ENEMY,
      x: fromX,
      y: fromY,
      dx: (displacement.x / distance) * velocity,
      dy: (displacement.y / distance) * velocity,
      color: 'red',
      ttl
    });
  }
}

function getInitialCfg(behaviour) {
  const randColor = getRandomNumber(0, 255).toString(16);

  switch (behaviour) {
    case 0:
      return {
        color: `#${randColor}8080`,
        shootDelay: getRandomNumber(30, 50),
        x: getRandomNumber(160, 480),
        y: -20,
        dy: getRandomNumber(1, 4),
      };

    default:
      return {
        color: `#${randColor}8080`,
        x: getRandomNumber(160, 480),
        y: getRandomNumber(20, 220),
        dx: getRandomNumber(1, 4),
      };
  };
}
