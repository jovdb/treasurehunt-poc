// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

import { IPoint, Point } from "../Point";
import { Transform, ITransform } from "../Transform";

declare module "../Point" {
  interface Point {
    transform(this: Point, transform: ITransform): Point;
  }
}

declare module "../Transform" {
  interface Transform {
    applyToPoint(this: Transform, point: IPoint): Point;
    applyToPoints(this: Transform, point: readonly IPoint[]): Point[];
  }
}

Point.prototype.transform = function transform(this, transform) {
  const [left, top] = Transform.transform(transform, this.left, this.top);
  return Point.create(left, top);
};

Transform.prototype.applyToPoint = function applyToPoint(this, point) {
  const [left, top] = Transform.transform(this, point.left, point.top);
  return Point.create(left, top);
};

Transform.prototype.applyToPoints = function applyToPoints(this, points) {
  return points.map(this.applyToPoint.bind(this));
};
