import type p5 from 'p5';

export interface Button {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  id: string;
}

const THEME = {
  dark: '#1B5E20',
  shadow: '#2E7D32',
  shadowLight: '#388E3C',
  text: '#FFFFFF',
};

export const isMouseOverButton = (p: p5, button: Button): boolean => {
  return (
    p.mouseX >= button.x - button.width / 2 &&
    p.mouseX <= button.x + button.width / 2 &&
    p.mouseY >= button.y - button.height / 2 &&
    p.mouseY <= button.y + button.height / 2
  );
};

export const drawButton = (p: p5, button: Button) => {
  const isHovered = isMouseOverButton(p, button);
  const buttonColor = isHovered ? THEME.shadowLight : THEME.shadow;

  p.push();
  p.fill(buttonColor);
  p.stroke(THEME.dark);
  p.strokeWeight(3);
  p.rectMode(p.CENTER);
  p.rect(button.x, button.y, button.width, button.height, 8);

  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(24);
  p.fill(THEME.text);
  p.textStyle(p.BOLD);
  p.text(button.text, button.x, button.y);
  p.pop();
};
