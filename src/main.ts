import { CURRENT_SCENE, changeCurrentScene, setSceneChangeCallback, applySceneChange } from '@/utils/scene';
import type { SceneType } from '@/types/status';
import { drawIntro, handleIntroClick } from '@/scenes/intro';
import { drawOutro } from '@/scenes/outro';
import { drawStart, handleStartClick } from '@/scenes/start';
import { drawGame, handleGameClick } from '@/scenes/game';
import { drawReady, handleReadyClick } from '@/scenes/ready';
import { drawScore, handleScoreClick, handleScoreWheel } from '@/scenes/score';

import startMp3 from '@/assets/audio/background/start.mp3';

import type { p5Instance, P5Constructor } from './types/p5-global';
import type { SoundFile } from 'p5';

const main = (p5: p5Instance) => {
  let sound: SoundFile;
  let soundStarted = false;

  // Fade 애니메이션 상태
  let fadeAlpha = 0;
  let isFading = false;
  let fadeDirection: 'in' | 'out' = 'out'; // 'out' = fade out, 'in' = fade in
  const fadeSpeed = 0.05; // fade 속도 (조절 가능)
  let pendingScene: SceneType | null = null; // 변경 예정인 씬
  let displayScene: SceneType = CURRENT_SCENE; // 실제로 그려질 씬

  // 씬 변경 감지 및 fade 시작
  setSceneChangeCallback((from, to) => {
    if (from !== null) {
      // 씬 변경 요청 시 fade out 시작 (CURRENT_SCENE은 아직 변경하지 않음)
      pendingScene = to;
      displayScene = from; // fade out 중에는 이전 씬을 계속 표시
      isFading = true;
      fadeDirection = 'out';
      fadeAlpha = 0;
    }
  });

  const startAudio = () => {
    if (soundStarted || !sound || !sound.isLoaded()) return;

    try {
      p5.userStartAudio();
      sound.setVolume(1);
      sound.loop();
      soundStarted = true;
    } catch (error) {
      console.error('오디오 로드 실패', error);
    }
  };

  window.startAudio = startAudio;
  p5.preload = () => {
    sound = p5.loadSound(startMp3, () => {
      console.log('오디오 로드 완료');
    });
  };

  p5.setup = () => {
    const { windowWidth, windowHeight } = p5;
    const canvas = p5.createCanvas(windowWidth, windowHeight);
    canvas.parent('app');
    changeCurrentScene('INTRO');
    displayScene = 'INTRO'; // 초기 씬 설정
  };

  p5.windowResized = () => {
    // 혹시라도 Browser 사이즈가 변경되면 이를 감지하여 Canvas 사이즈 조정
    const { windowWidth, windowHeight } = p5;
    p5.resizeCanvas(windowWidth, windowHeight);
  };

  p5.mousePressed = () => {
    // fade 중에는 클릭 무시
    if (isFading) return;

    // 각 씬의 맞는 Click 핸들링 코드가 호출되어 실행될 수 있도록 작업.
    switch (CURRENT_SCENE) {
      case 'INTRO':
        handleIntroClick(p5);
        break;
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
    // Fade 애니메이션 업데이트
    if (isFading) {
      if (fadeDirection === 'out') {
        fadeAlpha += fadeSpeed;
        if (fadeAlpha >= 1) {
          fadeAlpha = 1;
          // fade out 완료 후 씬 변경
          if (pendingScene !== null) {
            applySceneChange(pendingScene); // CURRENT_SCENE 실제 변경
            displayScene = pendingScene; // 표시 씬도 변경
            pendingScene = null;
            fadeDirection = 'in'; // fade in 시작
          }
        }
      } else {
        // fade in
        fadeAlpha -= fadeSpeed;
        if (fadeAlpha <= 0) {
          fadeAlpha = 0;
          isFading = false; // fade 완료
        }
      }
    }

    // 각 씬의 맞는 draw 코드가 호출되어 실행될 수 있도록 작업.
    // fade out 중에는 이전 씬을, fade in 중에는 새 씬을 표시
    switch (displayScene) {
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

    // Fade 오버레이
    if (fadeAlpha > 0) {
      p5.push();
      p5.fill(0, fadeAlpha * 255);
      p5.rectMode(p5.CORNER);
      p5.noStroke();
      p5.rect(0, 0, p5.width, p5.height);
      p5.pop();
    }
  };
};

const P5Constructor: P5Constructor = p5 as unknown as P5Constructor;
new P5Constructor(main);
