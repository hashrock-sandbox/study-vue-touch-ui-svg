export interface Point {
  x: number;
  y: number;
}

export interface FusenItem extends Rect {
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

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function getBoundPoint(item: Rect) {
  return function(degree: number): Point {
    const calc = [
      { degree: 0, o: { x: item.w, y: item.h / 2 } },
      { degree: 45, o: { x: item.w, y: item.h } },
      { degree: 90, o: { x: item.w / 2, y: item.h } },
      { degree: 135, o: { x: 0, y: item.h } },
      { degree: 180, o: { x: 0, y: item.h / 2 } },
      { degree: 225, o: { x: item.w, y: 0 } },
      { degree: 270, o: { x: item.w / 2, y: 0 } },
      { degree: 315, o: { x: 0, y: 0 } }
    ];

    for (const c of calc) {
      if (c.degree === degree) {
        return c.o;
      }
    }

    return { x: 0, y: 0 };
  };
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
