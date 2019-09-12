import { Base} from './base';
import { TYPE_BULLET_ENEMY } from './bullet';
import { getRandomNumber } from './utils';

export const TYPE_ENEMY_SIMPLE = 200;

// enemy behaviour
// - 0: straight from top to bottom, no fire
// - 1: movement like 0, fire towards hero once randomly
// - 2: from top to bottom with a little bit diagonal with fire
// - 3: movement like 0, fire towards hero 2 or 3 times randomly
// - lock & targeted towards hero with higher speed. Shoot once
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
    const { sprite } = this;
    const { shootDelays } = sprite;
    const canvas = sprite.context.canvas;
    const posY = sprite.y;
    const posX = sprite.x;

    if ((posY + sprite.radius > canvas.height + 100) ||
      (posX < -100) || (posX + sprite.radius > canvas.width + 100)
    ) {
      this.kill();
    }

    if (shootDelays[0] !== undefined) {
      if (shootDelays[0] <= 0) {
        this.fire(sprite.poolBullets, sprite.hero.x, sprite.hero.y, 2);

        // next shoot
        shootDelays.shift();
      } else {
        shootDelays[0]--;
      }
    }

    super.update(dt);
  }

  fire(poolBullets, toX, toY, velocity = 10, ttl = Infinity) {
    this._fireDelayer = 20;

    // calculate bullet shooting direction
    const { x: fromX, y: fromY } = this.sprite;
    // console.log(`firing from (${fromX},${fromY}) to (${toX},${toY})`);
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
  const randColor = `#${getRandomNumber(0, 255).toString(16)}8080`;

  if (behaviour > 2) {
    behaviour = 1 + Math.floor(Math.random() * 2);
  }

  switch (behaviour) {
    case 3:
      return {
        color: randColor,
        shootDelays: [getRandomNumber(10, 30), getRandomNumber(30, 50)],
        x: getRandomNumber(160, 480),
        y: -20,
        dy: getRandomNumber(1, 4),
      };

    case 2:
      return {
        color: randColor,
        shootDelays: [getRandomNumber(30, 50)],
        x: getRandomNumber(160, 480),
        y: -10,
        dx: getRandomNumber(1, 4),
        dy: getRandomNumber(2, 4),
      };

    case 1:
      return {
        color: randColor,
        shootDelays: [getRandomNumber(30, 50)],
        x: getRandomNumber(160, 480),
        y: -20,
        dy: getRandomNumber(1, 4),
      };

    case 0:
    default:
      return {
        color: randColor,
        shootDelays: [],
        x: getRandomNumber(160, 480),
        y: -20,
        dy: getRandomNumber(1, 4),
      };
  };
}
