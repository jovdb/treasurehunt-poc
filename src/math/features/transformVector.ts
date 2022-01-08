// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

import { Vector, IVector } from "../Vector";
import { ITransform, Transform } from "../Transform";

declare module "../Vector" {
  interface Vector {
    transform(this: Vector, transform: ITransform): Vector;
  }
}

declare module "../Transform" {
  interface Transform {
    applyToVector(this: Transform, vector: IVector): Vector;

    /** Get the transform to move by this vector */
    translateByVector(this: Transform, vector: IVector): Transform;

    /** Get the transform to scale by this vector (1, 1) = no scale */
    scaleByVector(this: Transform, vector: IVector): Transform;

    /** Get the transform to rotate by the angle created by this vector */
    rotateByVector(this: Transform, vector: IVector): Transform;
  }
}

Vector.prototype.transform = function transform(this, transform) {
  const [width, height] = Transform.transform(transform, this.width, this.height, 0); // Pass 0 as w!
  return Vector.create(width, height);
};

Transform.prototype.applyToVector = function applyToPoint(this, vector) {
  const [width, height] = Transform.transform(this, vector.width, vector.height, 0); // Pass 0 as w!
  return Vector.create(width, height);
};

Transform.prototype.translateByVector = function translateByVector(this, vector) {
  return this.multiply(Transform.translate(vector.width, vector.height));
};

Transform.prototype.scaleByVector = function scaleByVector(this, vector) {
  return this.multiply(Transform.scale(vector.width, vector.height));
};

Transform.prototype.rotateByVector = function rotateByVector(this, vector) {
  return this.multiply(Transform.rotateByRad(Vector.fromObject(vector).getAngleRad()));
};

// fitInREct no transform, in Rect
// GPS by mouse
// test rotate * rotate
