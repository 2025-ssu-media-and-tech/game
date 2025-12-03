import type p5 from 'p5';

export type MapType = 'maze' | 'cross' | 'islands' | 'labyrinth' | 'chambers';

/**
 * 랜덤 맵 선택
 */
export const getRandomMap = (): MapType => {
  const maps: MapType[] = ['maze', 'cross', 'islands', 'labyrinth', 'chambers'];
  return maps[Math.floor(Math.random() * maps.length)];
};

/**
 * 맵 장식물 렌더링 (충돌 없는 시각적 장식)
 */
export const drawMapDecorations = (p: p5, mapType: MapType, cellSize: number, cols: number, rows: number): void => {
  switch (mapType) {
    case 'maze':
      drawMazeDecorations(p, cellSize, cols, rows);
      break;
    case 'cross':
      drawCrossDecorations(p, cellSize, cols, rows);
      break;
    case 'islands':
      drawIslandsDecorations(p, cellSize, cols, rows);
      break;
    case 'labyrinth':
      drawLabyrinthDecorations(p, cellSize, cols, rows);
      break;
    case 'chambers':
      drawChambersDecorations(p, cellSize, cols, rows);
      break;
  }
};

/**
 * 맵 배경 렌더링
 */
export const drawMapBackground = (p: p5, mapType: MapType, cellSize: number, cols: number, rows: number): void => {
  p.push();

  // 기본 배경 색상
  const bgColors: Record<MapType, [number, number, number]> = {
    maze: [15, 15, 20],
    cross: [20, 15, 25],
    islands: [10, 20, 15],
    labyrinth: [25, 20, 15],
    chambers: [15, 20, 25],
  };

  const bgColor = bgColors[mapType];
  p.background(bgColor[0], bgColor[1], bgColor[2]);

  // 그리드 라인
  p.stroke(40, 40, 50, 50);
  p.strokeWeight(1);
  for (let x = 0; x <= cols; x++) {
    p.line(x * cellSize, 0, x * cellSize, p.height);
  }
  for (let y = 0; y <= rows; y++) {
    p.line(0, y * cellSize, p.width, y * cellSize);
  }

  p.pop();
};

/**
 * 미로 맵 장식물 - 돌기둥과 횃불
 */
const drawMazeDecorations = (p: p5, cellSize: number, cols: number, rows: number): void => {
  p.push();
  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);

  // 돌기둥 장식
  for (let x = 3; x < cols - 3; x += 5) {
    for (let y = 3; y < rows - 3; y += 5) {
      if (Math.abs(x - centerX) > 4 || Math.abs(y - centerY) > 4) {
        const px = x * cellSize + cellSize / 2;
        const py = y * cellSize + cellSize / 2;

        // 돌기둥 그림자
        p.fill(30, 30, 35, 150);
        p.noStroke();
        p.ellipse(px + 2, py + 2, cellSize * 0.6);

        // 돌기둥
        p.fill(60, 60, 70);
        p.ellipse(px, py, cellSize * 0.5);

        // 돌기둥 하이라이트
        p.fill(80, 80, 90);
        p.ellipse(px - cellSize * 0.1, py - cellSize * 0.1, cellSize * 0.2);
      }
    }
  }

  // 횃불 장식
  for (let x = 6; x < cols - 6; x += 8) {
    for (let y = 6; y < rows - 6; y += 8) {
      if (Math.abs(x - centerX) > 5 || Math.abs(y - centerY) > 5) {
        const px = x * cellSize + cellSize / 2;
        const py = y * cellSize + cellSize / 2;

        // 횃불 기둥
        p.fill(80, 60, 40);
        p.rect(px - cellSize * 0.1, py, cellSize * 0.2, cellSize * 0.4);

        // 불꽃
        const flameSize = cellSize * 0.3 + p.sin(p.millis() * 0.01 + x + y) * 2;
        p.fill(255, 150 + p.sin(p.millis() * 0.01 + x + y) * 50, 0, 200);
        p.ellipse(px, py - cellSize * 0.15, flameSize);
        p.fill(255, 200, 0, 150);
        p.ellipse(px, py - cellSize * 0.2, flameSize * 0.7);
      }
    }
  }

  p.pop();
};

/**
 * 십자가 맵 장식물 - 십자가 기념비와 꽃
 */
const drawCrossDecorations = (p: p5, cellSize: number, cols: number, rows: number): void => {
  p.push();
  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);

  // 십자가 기념비 (중앙 십자가 라인에)
  const crossPositions = [
    { x: centerX, y: Math.floor(rows * 0.2) },
    { x: centerX, y: Math.floor(rows * 0.8) },
    { x: Math.floor(cols * 0.2), y: centerY },
    { x: Math.floor(cols * 0.8), y: centerY },
  ];

  crossPositions.forEach((pos) => {
    if (Math.abs(pos.x - centerX) > 3 || Math.abs(pos.y - centerY) > 3) {
      const px = pos.x * cellSize + cellSize / 2;
      const py = pos.y * cellSize + cellSize / 2;

      // 기념비 기둥
      p.fill(100, 100, 110);
      p.rect(px - cellSize * 0.15, py - cellSize * 0.3, cellSize * 0.3, cellSize * 0.6, 2);

      // 십자가
      p.fill(200, 200, 210);
      p.rect(px - cellSize * 0.25, py - cellSize * 0.4, cellSize * 0.5, cellSize * 0.15, 2);
      p.rect(px - cellSize * 0.1, py - cellSize * 0.55, cellSize * 0.2, cellSize * 0.4, 2);
    }
  });

  // 꽃 장식
  for (let x = 4; x < cols - 4; x += 6) {
    for (let y = 4; y < rows - 4; y += 6) {
      if (Math.abs(x - centerX) > 4 || Math.abs(y - centerY) > 4) {
        const px = x * cellSize + cellSize / 2;
        const py = y * cellSize + cellSize / 2;

        // 꽃잎
        const petalSize = cellSize * 0.15;
        const colors = [
          [255, 100, 150], // 핑크
          [150, 200, 255], // 파랑
          [255, 200, 100], // 노랑
        ];
        const color = colors[(x + y) % colors.length];

        for (let i = 0; i < 5; i++) {
          const angle = (p.TWO_PI / 5) * i;
          const petalX = px + p.cos(angle) * petalSize;
          const petalY = py + p.sin(angle) * petalSize;
          p.fill(color[0], color[1], color[2], 180);
          p.ellipse(petalX, petalY, petalSize);
        }

        // 꽃 중앙
        p.fill(255, 220, 100);
        p.ellipse(px, py, petalSize * 0.6);
      }
    }
  }

  p.pop();
};

/**
 * 섬 맵 장식물 - 나무와 돌
 */
const drawIslandsDecorations = (p: p5, cellSize: number, cols: number, rows: number): void => {
  p.push();
  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);

  // 나무 장식
  const treePositions = [
    { x: Math.floor(cols * 0.2), y: Math.floor(rows * 0.2) },
    { x: Math.floor(cols * 0.8), y: Math.floor(rows * 0.2) },
    { x: Math.floor(cols * 0.2), y: Math.floor(rows * 0.8) },
    { x: Math.floor(cols * 0.8), y: Math.floor(rows * 0.8) },
    { x: Math.floor(cols * 0.5), y: Math.floor(rows * 0.3) },
    { x: Math.floor(cols * 0.5), y: Math.floor(rows * 0.7) },
  ];

  treePositions.forEach((pos) => {
    if (Math.abs(pos.x - centerX) > 4 || Math.abs(pos.y - centerY) > 4) {
      const px = pos.x * cellSize + cellSize / 2;
      const py = pos.y * cellSize + cellSize / 2;

      // 나무 줄기
      p.fill(80, 50, 30);
      p.rect(px - cellSize * 0.08, py, cellSize * 0.16, cellSize * 0.4);

      // 나뭇잎 (원형)
      p.fill(30, 120, 50);
      p.ellipse(px, py - cellSize * 0.1, cellSize * 0.5);
      p.fill(40, 140, 60);
      p.ellipse(px - cellSize * 0.1, py - cellSize * 0.15, cellSize * 0.4);
      p.ellipse(px + cellSize * 0.1, py - cellSize * 0.15, cellSize * 0.4);
    }
  });

  // 돌 장식
  for (let x = 5; x < cols - 5; x += 7) {
    for (let y = 5; y < rows - 5; y += 7) {
      if (Math.abs(x - centerX) > 5 || Math.abs(y - centerY) > 5) {
        const px = x * cellSize + cellSize / 2;
        const py = y * cellSize + cellSize / 2;

        // 돌 그림자
        p.fill(40, 40, 45, 120);
        p.ellipse(px + 1, py + 1, cellSize * 0.3);

        // 돌
        p.fill(70, 70, 75);
        p.ellipse(px, py, cellSize * 0.25);

        // 돌 하이라이트
        p.fill(90, 90, 95);
        p.ellipse(px - cellSize * 0.05, py - cellSize * 0.05, cellSize * 0.1);
      }
    }
  }

  p.pop();
};

/**
 * 미궁 맵 장식물 - 보석과 등불
 */
const drawLabyrinthDecorations = (p: p5, cellSize: number, cols: number, rows: number): void => {
  p.push();
  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);

  // 보석 장식
  for (let x = 4; x < cols - 4; x += 6) {
    for (let y = 4; y < rows - 4; y += 6) {
      if (Math.abs(x - centerX) > 4 || Math.abs(y - centerY) > 4) {
        const px = x * cellSize + cellSize / 2;
        const py = y * cellSize + cellSize / 2;

        const gemColors = [
          [255, 100, 150], // 핑크
          [100, 200, 255], // 파랑
          [150, 255, 150], // 녹색
          [255, 200, 100], // 노랑
        ];
        const color = gemColors[(x + y) % gemColors.length];

        // 보석 그림자
        p.fill(0, 0, 0, 100);
        p.ellipse(px + 1, py + 1, cellSize * 0.3);

        // 보석 본체 (다이아몬드 형태)
        p.fill(color[0], color[1], color[2], 220);
        p.beginShape();
        p.vertex(px, py - cellSize * 0.15);
        p.vertex(px + cellSize * 0.1, py);
        p.vertex(px, py + cellSize * 0.15);
        p.vertex(px - cellSize * 0.1, py);
        p.endShape(p.CLOSE);

        // 보석 하이라이트
        p.fill(255, 255, 255, 180);
        p.ellipse(px - cellSize * 0.03, py - cellSize * 0.05, cellSize * 0.08);
      }
    }
  }

  // 등불 장식
  for (let x = 7; x < cols - 7; x += 9) {
    for (let y = 7; y < rows - 7; y += 9) {
      if (Math.abs(x - centerX) > 6 || Math.abs(y - centerY) > 6) {
        const px = x * cellSize + cellSize / 2;
        const py = y * cellSize + cellSize / 2;

        // 등불 기둥
        p.fill(100, 80, 60);
        p.rect(px - cellSize * 0.06, py, cellSize * 0.12, cellSize * 0.3);

        // 등불 유리
        p.fill(200, 200, 150, 100);
        p.ellipse(px, py - cellSize * 0.05, cellSize * 0.25);

        // 등불 불꽃
        const flameSize = cellSize * 0.15 + p.sin(p.millis() * 0.008 + x + y) * 2;
        p.fill(255, 180 + p.sin(p.millis() * 0.008 + x + y) * 30, 0, 180);
        p.ellipse(px, py - cellSize * 0.1, flameSize);
      }
    }
  }

  p.pop();
};

/**
 * 방 맵 장식물 - 가구와 화분
 */
const drawChambersDecorations = (p: p5, cellSize: number, cols: number, rows: number): void => {
  p.push();

  const roomCols = 4;
  const roomRows = 4;
  const roomWidth = Math.floor(cols / roomCols);
  const roomHeight = Math.floor(rows / roomRows);

  // 각 방에 장식물 배치
  for (let roomX = 0; roomX < roomCols; roomX++) {
    for (let roomY = 0; roomY < roomRows; roomY++) {
      const roomStartX = roomX * roomWidth;
      const roomStartY = roomY * roomHeight;
      const roomCenterX = roomStartX + roomWidth / 2;
      const roomCenterY = roomStartY + roomHeight / 2;

      // 중앙 방은 제외
      if (roomX === Math.floor(roomCols / 2) && roomY === Math.floor(roomRows / 2)) {
        continue;
      }

      // 화분 장식
      const potX = roomCenterX * cellSize;
      const potY = (roomCenterY - roomHeight * 0.2) * cellSize;

      // 화분
      p.fill(120, 80, 60);
      p.rect(potX - cellSize * 0.15, potY, cellSize * 0.3, cellSize * 0.2, 2);

      // 식물
      p.fill(30, 150, 50);
      p.ellipse(potX, potY - cellSize * 0.05, cellSize * 0.4);
      p.fill(40, 170, 60);
      p.ellipse(potX - cellSize * 0.1, potY - cellSize * 0.1, cellSize * 0.3);
      p.ellipse(potX + cellSize * 0.1, potY - cellSize * 0.1, cellSize * 0.3);

      // 테이블 장식
      const tableX = (roomCenterX + roomWidth * 0.2) * cellSize;
      const tableY = (roomCenterY + roomHeight * 0.2) * cellSize;

      // 테이블 다리
      p.fill(80, 60, 40);
      p.rect(tableX - cellSize * 0.2, tableY, cellSize * 0.05, cellSize * 0.15);
      p.rect(tableX + cellSize * 0.15, tableY, cellSize * 0.05, cellSize * 0.15);

      // 테이블 상판
      p.fill(100, 80, 60);
      p.rect(tableX - cellSize * 0.25, tableY - cellSize * 0.05, cellSize * 0.5, cellSize * 0.1, 2);

      // 테이블 위 촛불
      p.fill(200, 180, 100);
      p.rect(tableX - cellSize * 0.02, tableY - cellSize * 0.1, cellSize * 0.04, cellSize * 0.08);
      const candleFlame = cellSize * 0.06 + p.sin(p.millis() * 0.01 + roomX + roomY) * 1;
      p.fill(255, 150, 0, 200);
      p.ellipse(tableX, tableY - cellSize * 0.15, candleFlame);
    }
  }

  p.pop();
};
