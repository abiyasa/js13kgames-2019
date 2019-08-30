export class Base {
  update(dt) {
    this.sprite && this.sprite.update(dt);
  }

  render() {
    this.sprite && this.sprite.render();
  }

  collidesWith(target) {
    return this.sprite && this.sprite.collidesWith(target.sprite);
  }
}
