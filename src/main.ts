import p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene';
import { drawIntro } from '@/scenes/intro';
import { drawOutro } from '@/scenes/outro';
import { drawStart, handleStartClick } from '@/scenes/start';
import { drawGame } from '@/scenes/game';

const main = (p5: p5) => {
  p5.setup = () => {
    const { windowWidth, windowHeight } = p5;

    const canvas = p5.createCanvas(windowWidth, windowHeight);
    canvas.parent('app');

    // 디버깅용 - START 씬으로 전환, 주석 해제하면 START 씬으로 전환
    // changeCurrentScene('START');
    changeCurrentScene('GAME');
  };
  p5.windowResized = () => {
    // 혹시라도 Browser 사이즈가 변경되면 이를 감지하여 Canvas 사이즈 조정
    const { windowWidth, windowHeight } = p5;
    p5.resizeCanvas(windowWidth, windowHeight);
  };
  p5.draw = () => {
    // 각 씬의 맞는 draw 코드가 호출되어 실행될 수 있도록 작업.
    switch (CURRENT_SCENE) {
      case 'INTRO':
        drawIntro(p5);
        break;
      case 'START':
        p5.mousePressed = () => {
          handleStartClick(p5);
        };
        drawStart(p5);
        break;
      case 'READY':
        console.log(CURRENT_SCENE);
        break;
      case 'GAME':
        drawGame(p5);
        break;
      case 'SCORE':
        console.log(CURRENT_SCENE);
        break;
      case 'END':
        console.log(CURRENT_SCENE);
        break;
      case 'OUTRO':
        drawOutro(p5);
        break;
      default:
        // no-op, 여기까지 코드가 도달할 일은 없습니다.
        console.log('잘못 된 Scene 값입니다.');
        return;
    }
  };
};

new p5(main);
