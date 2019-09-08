import { Base} from './base';
import { TYPE_BULLET_ENEMY } from './bullet';

const { random, floor } = Math;

export const TYPE_ENEMY_SIMPLE = 200;

// TODO: movement type
// - straight from top to bottom
// - chase slowly towards player
// - straight from top and then stop within distance (to fire)
// - straight from top and then stop within distance (to fire) for a delay, and then continue

// TODO: shooting type
// - shoot every X secs towards player
// - shoot once
// - shoot with certain pattern direction
// - spread shoot

export class Enemy extends Base {
  init(props = {}) {
    const baseCfg = {
      color: 'black',
      width: 20,
      height: 40,
      radius: 10,
    };

    this.behaviour = props.behaviour;
    let movementCfg = getInitialCfg(this.behaviour);

    super.init({
      ...baseCfg,
      ...movementCfg,
      ...props
    });
  }

  update(dt) {
    const { sprite } = this;

    // limit movement
    if (sprite.x + sprite.radius > sprite.context.canvas.width) {
      sprite.dx = -sprite.dx;
    } else if (sprite.x - sprite.radius < 0) {
      sprite.dx = -sprite.dx;
    }

    // TODO: to shot or not

    super.update(dt);
  }

  fire(poolBullets, toX, toY, velocity = 10) {
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
      ttl: 60
    });
  }
}

function getInitialCfg(enemyBehaviour) {
  const randColor = floor(random() * 255).toString(16);

  switch (enemyBehaviour) {
    case 0:
    default:
      return {
        ttl: Infinity,
        color: `#${randColor}8080`,
        x: 160 + floor(random() * 320),
        y: 20 + floor(random() * 200),
        dx: 1 + floor(random() * 3),
      };
  };
}
