import { Sprite } from 'kontra';

export class Base {
  constructor(props = {}) {
    this.sprite = Sprite(props);
  }

  init(props = {}) {
    this.sprite.init(props);
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
