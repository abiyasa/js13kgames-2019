import { GameEngine } from './app/game';
import './styles/main.css'

const gameUI = {
  btnPause: document.querySelector('#button-pause'),
  labelHeroHp: document.querySelector('#ui-hero-hp'),
};

async function main() {
  await GameEngine.init({ gameUI });
  GameEngine.start();

  gameUI.btnPause.addEventListener('click', () => {
    if (GameEngine.isGameOver()) return;

    const isPaused = GameEngine.pause();
    gameUI.btnPause.textContent = isPaused ? 'Pause' : 'Unpause';
  });

  document.addEventListener('gameOver', () => {
    // TODO display game over
    console.log('GAME OVER');
  });
}

main();
