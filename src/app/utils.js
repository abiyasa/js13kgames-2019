const { random, floor } = Math;
const DOMURL = window.URL || window.webkitURL || window;

export function getRandomNumber(min, max) {
  return min + floor(random() * max);
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

export async function createCanvasFromSVG(inlineSvg, width, height) {
  const svgImage = await loadSVG(inlineSvg);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(svgImage, 0, 0);

  return canvas;
}
