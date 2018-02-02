export interface Point {
  x: number;
  y: number;
}

export function addPoint(p1: Point, p2: Point) {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y
  };
}

export class Rect {
  x: number = 0;
  y: number = 0;
  w: number = 0;
  h: number = 0;

  get offset(): Point {
    return {
      x: this.x,
      y: this.y
    };
  }
  get localCenter(): Point {
    return { x: this.w / 2, y: this.h / 2 };
  }
  get center(): Point {
    return addPoint(this.offset, this.localCenter);
  }

  get localRight(): Point {
    return { x: this.w, y: this.localCenter.y };
  }
  get right(): Point {
    return addPoint(this.offset, this.localRight);
  }

  get localRightBottom(): Point {
    return { x: this.w, y: this.h };
  }
  get rightBottom(): Point {
    return addPoint(this.offset, this.localRightBottom);
  }

  get localBottom(): Point {
    return { x: this.localCenter.x, y: this.h };
  }
  get bottom(): Point {
    return addPoint(this.offset, this.localBottom);
  }

  get localLeftBottom(): Point {
    return { x: 0, y: this.h };
  }
  get leftBottom(): Point {
    return addPoint(this.offset, this.localLeftBottom);
  }

  get localLeft(): Point {
    return { x: 0, y: this.localCenter.y };
  }
  get left(): Point {
    return addPoint(this.offset, this.localLeft);
  }

  get localLeftTop(): Point {
    return { x: 0, y: 0 };
  }
  get leftTop(): Point {
    return addPoint(this.offset, this.localLeftTop);
  }

  get localTop(): Point {
    return { x: this.localCenter.x, y: 0 };
  }
  get top(): Point {
    return addPoint(this.offset, this.localTop);
  }

  get localRightTop(): Point {
    return { x: this.w, y: 0 };
  }
  get rightTop(): Point {
    return addPoint(this.offset, this.localRightTop);
  }
}

export class FusenItem extends Rect {
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
  item: FusenItem,
  position: number,
  offset: number
): Point {
  let px = item.x;
  let py = item.y;

  if (position === 0) {
    px = item.right.x + offset;
    py = item.right.y;
  }
  if (position === 90) {
    px = item.bottom.x;
    py = item.bottom.y + offset;
  }
  if (position === 180) {
    px -= offset;
    py = item.left.y;
  }
  if (position === 270) {
    px = item.top.x;
    py -= offset;
  }

  return { x: px, y: py };
}
