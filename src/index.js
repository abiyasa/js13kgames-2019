import { GameEngine } from './app/game';
import { loadSVG } from './app/utils';
import './styles/main.css'
import assetIntro from './app/intro.svg';


async function main() {
  const assets = await initAssets();

  const imageContainerEl = document.querySelector('.filler');
  imageContainerEl.appendChild(assets.intro);

  document.querySelector('#button-start').addEventListener('click', () => {
    document.querySelector('#screen-intro').classList.add('hidden');
    document.querySelector('#screen-game').classList.remove('hidden');

    startGame();
  });
}

main();

async function startGame() {
  const gameUI = {
    btnPause: document.querySelector('#button-pause'),
    labelHeroHp: document.querySelector('#ui-hero-hp'),
    labelScore: document.querySelector('#ui-score'),
    panelGameOver: document.querySelector('#panel-game-over'),
    btnRetry: document.querySelector('#button-retry'),
  };

  await GameEngine.init({ gameUI });
  GameEngine.start();

  gameUI.btnPause.addEventListener('click', () => {
    if (GameEngine.isGameOver()) return;

    const isPaused = GameEngine.pause();
    gameUI.btnPause.textContent = isPaused ? 'Pause' : 'Unpause';
  });

  gameUI.btnRetry.addEventListener('click', () => {
    // restart the game
    window.location.reload();
  });

  document.addEventListener('gameOver', () => {
    // display game over
    gameUI.btnPause.setAttribute('disabled', true);
    gameUI.panelGameOver.className = '';
  });
}

async function initAssets() {
  const intro = await loadSVG(assetIntro);

  return {
    intro,
  };
}
