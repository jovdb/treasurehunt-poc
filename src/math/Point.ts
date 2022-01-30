import { areSimilar } from "./Number";

export interface IPoint {
  left: number;
  top: number;
}

export class Point {
  private constructor(public left: number, public top: number) {
    // Empty
  }

  static create = (left: number, top: number) => new this(left, top);

  static zero = Point.create(0, 0);

  static fromTuple = (point: [left: number, top: number]) => new this(point[0], point[1]);

  static fromObject = (point: IPoint) => (point instanceof Point ? point : new this(point.left, point.top));

  static areSimilar = (point1: IPoint, point2: IPoint, epsilon?: number) => areSimilar(point1.left, point2.left, epsilon) && areSimilar(point1.top, point2.top, epsilon);

  public addPoint(point: IPoint) {
    return Point.create(this.left + point.left, this.top + point.top);
  }

  public subtractPoint(point: IPoint) {
    return Point.create(this.left - point.left, this.top - point.top);
  }

  public areSimilar(point: IPoint) {
    return Point.areSimilar(this, point);
  }

  public toTuple(): [left: number, top: number] {
    return [this.left, this.top];
  }

  public toObject(): IPoint {
    return { left: this.left, top: this.top };
  }

  public toString() {
    return `point(${this.left}, ${this.top})`;
  }
}
