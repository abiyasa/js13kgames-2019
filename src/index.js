import { GameEngine } from './app/game';
import './styles/main.css'

GameEngine.init();
GameEngine.start();
document.querySelector('#button-pause').addEventListener('click', () => {
  GameEngine.pause();
});
