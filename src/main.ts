import p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene';
import { drawIntro } from '@/scenes/intro';
import { drawOutro } from '@/scenes/outro';
import { drawStart, handleStartClick } from '@/scenes/start';
import { drawGame, handleGameClick } from '@/scenes/game';
import { drawReady, handleReadyClick } from '@/scenes/ready';
import { drawScore, handleScoreClick, handleScoreWheel } from '@/scenes/score';

const main = (p5: p5) => {
  p5.setup = () => {
    const { windowWidth, windowHeight } = p5;

    const canvas = p5.createCanvas(windowWidth, windowHeight);
    canvas.parent('app');

    changeCurrentScene('START');
  };

  p5.windowResized = () => {
    // 혹시라도 Browser 사이즈가 변경되면 이를 감지하여 Canvas 사이즈 조정
    const { windowWidth, windowHeight } = p5;
    p5.resizeCanvas(windowWidth, windowHeight);
  };

  // 마우스 클릭 감지 (Global)
  p5.mousePressed = () => {
    // 각 씬의 맞는 Click 핸들링 코드가 호출되어 실행될 수 있도록 작업.
    switch (CURRENT_SCENE) {
      case 'START':
        handleStartClick(p5);
        break;
      case 'READY':
        handleReadyClick(p5);
        break;
      case 'GAME':
        handleGameClick(p5);
        break;
      case 'SCORE':
        handleScoreClick(p5);
        break;
    }
  };

  // 마우스 휠 감지 (Global)
  p5.mouseWheel = (event: { delta: number }) => {
    switch (CURRENT_SCENE) {
      case 'SCORE':
        handleScoreWheel(p5, event);
        break;
    }
    return false; // 기본 스크롤 동작 방지
  };

  p5.draw = () => {
    // 각 씬의 맞는 draw 코드가 호출되어 실행될 수 있도록 작업.
    switch (CURRENT_SCENE) {
      case 'INTRO':
        drawIntro(p5);
        break;
      case 'START':
        drawStart(p5);
        break;
      case 'READY':
        drawReady(p5);
        break;
      case 'GAME':
        drawGame(p5);
        break;
      case 'SCORE':
        drawScore(p5);
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
