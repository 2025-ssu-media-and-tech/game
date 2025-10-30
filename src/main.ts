import p5 from 'p5';

const main = (p5: p5) => {
  p5.setup = () => {
    const { windowWidth, windowHeight } = p5;

    const canvas = p5.createCanvas(windowWidth, windowHeight);
    canvas.parent('app');
  };
  p5.draw = () => {};
};

new p5(main);
