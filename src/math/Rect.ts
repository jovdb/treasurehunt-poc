import { areSimilar } from "./Number";
import { Point, IPoint } from "./Point";

export interface IRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export class Rect {
  private constructor(public left: number, public top: number, public width: number, public height: number) {
    // Empty
  }

  static zero = new this(0, 0, 0, 0);

  static create = (left: number, top: number, width: number, height: number) => new this(left, top, width, height);

  static fromTuple = (tuple: [left: number, top: number, width: number, height: number]) => this.create(...tuple);

  static fromObject = (obj: IRect) => (obj instanceof Rect ? obj : this.create(obj.left, obj.top, obj.width, obj.height));

  static toObject = (obj: IRect) => {
    if (obj instanceof this) return obj.toObject();
    return obj;
  };

  /**
   * Normalizes the rectangle by making it's width and height positive
   * (so left/top is aways less than right/bottom)
   */
  static normalize(rect: IRect) {
    const {
      left, top, width, height,
    } = rect;
    if (width >= 0 && height >= 0) return Rect.fromObject(rect);

    return this.create(
      width >= 0 ? left : left + width,
      height >= 0 ? top : top + height,
      width >= 0 ? width : -width,
      height >= 0 ? height : -height,
    );
  }

  /**
   * Create a bounding rectangle of the specified points
   */
  static fromPoints(points: readonly IPoint[]) {
    if (!points || points.length <= 0) throw new Error("Cannot calculate bounds when no points are available.");
    // eslint-disable-next-line no-new
    if (points.length === 1) new this(points[0].left, points[0].top, 0, 0);
    if (points.length === 2) new this(points[0].left, points[0].top, points[1].left, points[1].top).normalize();

    let x1 = points[0].left;
    let y1 = points[0].top;
    let x2 = points[0].left;
    let y2 = points[0].top;

    points.forEach((point) => {
      if (point.left < x1) x1 = point.left;
      if (point.top < y1) y1 = point.top;
      if (point.left > x2) x2 = point.left;
      if (point.top > y2) y2 = point.top;
    });

    return new this(x1, y1, x2 - x1, y2 - y1);
  }

  /**
   * Create a bounding rectangle of the specified rects
   * Remark: rename to union?
   */
  static fromRects(rects: readonly IRect[]) {
    if (!rects || rects.length <= 0) throw new Error("Cannot calculate bounds when no rects are available.");
    if (rects.length === 1) Rect.fromObject(rects[0]);

    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = -Infinity;
    let y2 = -Infinity;

    rects.forEach((rect) => {
      const normalizedRect = Rect.normalize(rect);
      const right = normalizedRect.left + normalizedRect.width;
      const bottom = normalizedRect.top + normalizedRect.height;
      if (normalizedRect.left < x1) x1 = normalizedRect.left;
      if (normalizedRect.top < y1) y1 = normalizedRect.top;
      if (right > x2) x2 = right;
      if (bottom > y2) y2 = bottom;
    });

    return new this(x1, y1, x2 - x1, y2 - y1);
  }

  /** Compare the values of 2 rects */
  static areSimilar(rect1: IRect, rect2: IRect, epsilon = 1e-6) {
    if (!areSimilar(rect1.left, rect2.left, epsilon)) return false;
    if (!areSimilar(rect1.top, rect2.top, epsilon)) return false;
    if (!areSimilar(rect1.width, rect2.width, epsilon)) return false;
    if (!areSimilar(rect1.height, rect2.height, epsilon)) return false;
    return true;
  }

  public toTuple = (): [left: number, top: number, width: number, height: number] => [this.left, this.top, this.width, this.height];

  public toObject = (): IRect => ({
    left: this.left, top: this.top, width: this.width, height: this.height,
  });

  public getCenter = () => Point.create(this.left + this.width / 2, this.top + this.height / 2);

  public grow(top: number, right: number = top, bottom: number = top, left: number = right) {
    return new Rect(this.left - left, this.top - top, Math.max(0, this.width + left + right), Math.max(0, this.height + top + bottom));
  }

  /**
   * Log Rect information to console
   * @param You can pass a debug string or a function that does custom formating with the rect
   */
  public debug(arg?: string | ((rect: this) => void)): this {
    if (typeof arg === "function") {
      const result = arg(this);
      // eslint-disable-next-line no-console
      if (result !== undefined) console.log(result);
    } else {
      // eslint-disable-next-line no-console
      console.log(arg, this.toString());
    }
    return this;
  }

  /**
   * Normalizes the rectangle by making it's width and height positive
   * (so left/top is aways less than right/bottom)
   */
  public normalize() {
    return Rect.normalize(this);
  }

  /** Compare the values of 2 rects */
  public areSimilar(rect: IRect, epsilon = 1e-6) {
    return Rect.areSimilar(this, rect, epsilon);
  }

  public containsPoint(point: IPoint) {
    return (
      point.left >= this.left
      && point.left <= this.left + this.width
      && point.top >= this.top
      && point.top <= this.top + this.height
    );
  }

  public toString() {
    return `rect(${this.left}, ${this.top}, ${this.width}, ${this.height})`;
  }
}
