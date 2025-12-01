import { CURRENT_SCENE, changeCurrentScene, setSceneChangeCallback, applySceneChange } from '@/utils/scene';
import type { SceneType } from '@/types/status';
import { drawIntro, handleIntroClick } from '@/scenes/intro';
import { drawOutro } from '@/scenes/outro';
import { drawStart, handleStartClick } from '@/scenes/start';
import { drawGame, handleGameClick } from '@/scenes/game';
import { drawReady, handleReadyClick } from '@/scenes/ready';
import { drawScore, handleScoreClick, handleScoreWheel } from '@/scenes/score';

import startMp3 from '@/assets/audio/background/start.mp3';
import clickWav from '@/assets/audio/effect/click.wav';
import outWav from '@/assets/audio/effect/out.wav';
import eatWav from '@/assets/audio/effect/eat.wav';
import battleBgm from '@/assets/audio/background/battlebgm-16bitfeelingsounds-384003.mp3';
import gameBackground1 from '@/assets/audio/background/game-background-1-321720.mp3';
import grooveQuest from '@/assets/audio/background/groove-quest-288437.mp3';
import pixelatedAdventure from '@/assets/audio/background/pixelated-adventure-hyperpop-music-122039.mp3';

import type { p5Instance, P5Constructor } from '@/types/p5-global';
import type { SoundFile } from 'p5';

const main = (p5: p5Instance) => {
  let sound: SoundFile; // 인트로 배경 음악
  let clickSound: SoundFile; // 클릭 효과음
  let outSound: SoundFile; // 게임오버 효과음
  let eatSound: SoundFile; // 열매 먹기 효과음
  let gameBgm: SoundFile | null = null; // 게임 배경음악
  let soundStarted = false;
  let gameBgmStarted = false;

  // Fade 애니메이션 상태
  let fadeAlpha = 0;
  let isFading = false;
  let fadeDirection: 'in' | 'out' = 'out'; // 'out' = fade out, 'in' = fade in
  const fadeSpeed = 0.05; // fade 속도 (조절 가능)
  let pendingScene: SceneType | null = null; // 변경 예정인 씬
  let displayScene: SceneType = CURRENT_SCENE; // 실제로 그려질 씬

  // 게임 배경음악 파일 목록
  const gameBgmFiles = [battleBgm, gameBackground1, grooveQuest, pixelatedAdventure];

  // 랜덤 게임 배경음악 선택 및 재생
  const startGameBgm = () => {
    try {
      // 기존 배경음악 정지
      if (sound && sound.isPlaying()) {
        sound.stop();
        soundStarted = false;
      }

      // 기존 게임 배경음악 정지
      if (gameBgm && gameBgm.isPlaying()) {
        gameBgm.stop();
      }

      // 매번 새로운 랜덤 배경음악 선택 및 로드
      const randomBgm = gameBgmFiles[Math.floor(Math.random() * gameBgmFiles.length)];
      gameBgm = p5.loadSound(randomBgm, () => {
        if (gameBgm && gameBgm.isLoaded()) {
          p5.userStartAudio();
          gameBgm.setVolume(1);
          gameBgm.loop();
          gameBgmStarted = true;
        }
      });
    } catch (error) {
      console.error('게임 배경음악 재생 실패', error);
    }
  };

  // 씬 변경 감지 및 fade 시작
  setSceneChangeCallback((from, to) => {
    if (from !== null) {
      // 씬 변경 요청 시 fade out 시작 (CURRENT_SCENE은 아직 변경하지 않음)
      pendingScene = to;
      displayScene = from; // fade out 중에는 이전 씬을 계속 표시
      isFading = true;
      fadeDirection = 'out';
      fadeAlpha = 0;

      // GAME 씬으로 진입 시 start.mp3 정지
      if (to === 'GAME') {
        if (sound && sound.isPlaying()) {
          sound.stop();
          soundStarted = false;
        }
      }

      // GAME 씬이 아닌 경우 게임 배경음악 정지
      if (to !== 'GAME' && gameBgm && gameBgm.isPlaying()) {
        gameBgm.stop();
        gameBgmStarted = false;
      }
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

  const playClickSound = () => {
    if (clickSound && clickSound.isLoaded()) {
      try {
        clickSound.setVolume(0.5);
        clickSound.play();
      } catch (error) {
        console.error('클릭 효과음 재생 실패', error);
      }
    }
  };

  const playOutSound = () => {
    if (outSound && outSound.isLoaded()) {
      try {
        outSound.setVolume(0.5);
        outSound.play();
      } catch (error) {
        console.error('게임오버 효과음 재생 실패', error);
      }
    }
  };

  const playEatSound = () => {
    if (eatSound && eatSound.isLoaded()) {
      try {
        eatSound.setVolume(1);
        eatSound.play();
      } catch (error) {
        console.error('열매 먹기 효과음 재생 실패', error);
      }
    }
  };

  const stopGameBgm = () => {
    if (gameBgm && gameBgm.isPlaying()) {
      gameBgm.stop();
      gameBgmStarted = false;
    }
  };

  window.startAudio = startAudio;
  window.playClickSound = playClickSound;
  window.playOutSound = playOutSound;
  window.playEatSound = playEatSound;
  window.stopGameBgm = stopGameBgm;
  window.startGameBgm = startGameBgm;
  p5.preload = () => {
    sound = p5.loadSound(startMp3, () => {
      console.log('오디오 로드 완료');
    });
    clickSound = p5.loadSound(clickWav, () => {
      console.log('클릭 효과음 로드 완료');
    });
    outSound = p5.loadSound(outWav, () => {
      console.log('게임오버 효과음 로드 완료');
    });
    eatSound = p5.loadSound(eatWav, () => {
      console.log('열매 먹기 효과음 로드 완료');
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
        handleIntroClick();
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

          // GAME 씬으로 진입한 경우 fade in 완료 후 배경음악 재생
          if (CURRENT_SCENE === 'GAME' && gameBgm && gameBgm.isLoaded() && !gameBgmStarted) {
            try {
              p5.userStartAudio();
              gameBgm.setVolume(1);
              gameBgm.loop();
              gameBgmStarted = true;
            } catch (error) {
              console.error('게임 배경음악 재생 실패', error);
            }
          }

          // START 또는 READY 씬으로 이동한 경우 start.mp3 재생
          if (
            (CURRENT_SCENE === 'START' || CURRENT_SCENE === 'READY') &&
            sound &&
            sound.isLoaded() &&
            !sound.isPlaying()
          ) {
            try {
              p5.userStartAudio();
              sound.setVolume(1);
              sound.loop();
              soundStarted = true;
            } catch (error) {
              console.error('배경음악 재생 실패', error);
            }
          }
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
