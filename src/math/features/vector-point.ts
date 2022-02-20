// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

import { Vector, IVector } from "../Vector";
import { Point } from "../Point";

declare module "../Vector" {
  // eslint-disable-next-line no-shadow
  interface Vector {
    /** Fit a vector or rect in this vector */
    toPoint(this: Vector): Point;
  }
}

declare module "../Point" {
  // eslint-disable-next-line no-shadow
  interface Point {
    /** Fit a vector or rect in this rect */
    addVector(this: Point, vector: IVector): Point;
  }
}

Vector.prototype.toPoint = function toPoint(this) {
  return Point.create(this.width, this.height);
};

Point.prototype.addVector = function addVector(this, vector: IVector) {
  return Point.create(this.left + vector.width, this.top + vector.height);
};
