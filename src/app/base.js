import { Sprite } from 'kontra';

export class Base {
  constructor(props = {}) {
    this.sprite = Sprite(props);
  }

  get x() {
    return this.sprite.x;
  }

  get y() {
    return this.sprite.y;
  }

  get width() {
    return this.sprite.width;
  }

  get height() {
    return this.sprite.width;
  }

  init(props = {}) {
    this.type = props.type;

    this.sprite.init({
      anchor: { x: 0.5, y: 0.5 },
      ...props
    });
  }

  update(dt) {
    this.sprite.update(dt);
  }

  render() {
    this.sprite.render();
  }

  isAlive() {
    return this.sprite.isAlive();
  }

  isAlive() {
    return this.sprite.isAlive();
  }

  kill() {
    this.sprite.ttl = 0;
  }

  collidesWith(target) {
    return this.sprite.collidesWith(target.sprite);
  }
}
