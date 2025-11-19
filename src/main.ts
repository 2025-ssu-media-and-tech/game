import p5 from 'p5';
import { CURRENT_SCENE, changeCurrentScene } from '@/utils/scene';
import { drawIntro } from '@/scenes/intro';
import { drawOutro } from '@/scenes/outro';
import { drawStart, handleStartClick } from '@/scenes/start';
import { drawGame, handleGameClick } from '@/scenes/game';
import { drawReady, handleReadyClick } from '@/scenes/ready';

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
    }
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
        // TBD. 임시로 추가한 SCORE Scene, 제대로 작업해서 변경해야 함.
        p5.background(0);
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(32);
        p5.text('Score Scene (To be implemented)', p5.width / 2, p5.height / 2);
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
