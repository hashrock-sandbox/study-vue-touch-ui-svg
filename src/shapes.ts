export interface Point {
  x: number;
  y: number;
}

export interface FusenItem {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  id: number;
  fromPosition: number;
  toPosition: number;
}

export interface Connector {
  id: number;
  from: number;
  fromPosition: number;
  to: number;
  toPosition: number;
  toPoint: number[];
  //変更する？
  arrowType: string[];
}

export function getConnectPosition(
  x: number,
  y: number,
  w: number,
  h: number,
  position: number,
  offset: number
): Point {
  let px = x;
  let py = y;

  if (position === 180) {
    px -= offset;
    py = y + h / 2;
  }
  if (position === 270) {
    px = x + w / 2;
    py -= offset;
  }
  if (position === 0) {
    px = x + w + offset;
    py = y + h / 2;
  }
  if (position === 90) {
    px = x + w / 2;
    py = y + h + offset;
  }

  return {
    x: px,
    y: py
  };
}
