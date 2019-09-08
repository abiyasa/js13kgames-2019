import { GameEngine } from './app/game';
import './styles/main.css'

const gameUI = {
  btnPause: document.querySelector('#button-pause'),
  labelHeroHp: document.querySelector('#ui-hero-hp'),
};

GameEngine.init({ gameUI });
GameEngine.start();

gameUI.btnPause.addEventListener('click', () => {
  const isPaused = GameEngine.pause();
  gameUI.btnPause.textContent = isPaused ? 'Pause' : 'Unpause';
});
