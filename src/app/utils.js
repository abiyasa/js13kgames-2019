const { random, floor } = Math;

export function getRandomNumber(min, max) {
  return min + floor(random() * max);
}
