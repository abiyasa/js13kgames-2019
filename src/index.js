import { GameEngine } from './app/game';
import './styles/main.css'

const gameUI = {
  btnPause: document.querySelector('#button-pause'),
  labelHeroHp: document.querySelector('#ui-hero-hp'),
  labelScore: document.querySelector('#ui-score'),
  panelGameOver: document.querySelector('#panel-game-over'),
  btnRetry: document.querySelector('#button-retry'),
};

async function main() {
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

main();
