const { random, round } = Math;
const DOMURL = window.URL || window.webkitURL || window;

/**
 * Get random number between min & max (min & max are included).
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomNumber(min, max) {
  return min + round(random() * (max - min));
}

export function loadSVG(inlineSvg) {
  // @see https://stackoverflow.com/a/25760896
  return new Promise(resolve => {
    const image = new Image();
    const svg = new Blob([inlineSvg], {
      type: 'image/svg+xml;charset=utf-8'
    });
    var url = DOMURL.createObjectURL(svg);

    image.onload = () => {
      DOMURL.revokeObjectURL(url);

      resolve(image);
    }

    image.src = url;
  });
}
