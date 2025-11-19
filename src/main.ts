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
    /*
    뱀 렌더러 예시입니다.
    const cellSize = 30;
    const gridX = Math.floor(p5.width / 2 / cellSize);
    const gridY = Math.floor(p5.height / 2 / cellSize);
    */

    /*
    뱀 위치 (머리부터 꼬리까지)
    const snakePositions: SnakePosition[] = [
      { x: gridX * cellSize, y: gridY * cellSize },
      { x: (gridX - 1) * cellSize, y: gridY * cellSize },
      { x: (gridX - 2) * cellSize, y: gridY * cellSize },
      { x: (gridX - 3) * cellSize, y: gridY * cellSize },
    ];
    */

    /* 
    뱀 그리기
    drawSnake(p5, snakePositions, cellSize);
    */

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

    // changeCurrentScene 예시.
    // changeCurrentScene('READY', () => {
    //   console.log('다음의 값으로 변경됨.', CURRENT_SCENE);
    //   // 변경된 씬의 필요한 데이터(이미지, 오디오 등...) 로드.
    // });
  };
};

new p5(main);
