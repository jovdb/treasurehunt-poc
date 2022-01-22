// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

import { Vector, IVector } from "../Vector";
import { Rect } from "../Rect";

declare module "../Vector" {
  // eslint-disable-next-line no-shadow
  interface Vector {
    /** Fit a vector or rect in this vector */
    fit(this: Vector, targetVector: IVector): Rect;
    toRect(this: Vector): Rect;
  }
}

declare module "../Rect" {
  // eslint-disable-next-line no-shadow
  interface Rect {
    /** Fit a vector or rect in this rect */
    fit(this: Rect, targetVector: IVector): Rect;
    toVector(this: Rect): Vector;
  }
}

/** Create a rect with the aspect ratio that fits this vector */
function fitAspectRatio(
  sourceWidth: number,
  sourceHeight: number,
  // eslint-disable-next-line no-shadow
  fitAspectRatio: number,
  sourceLeft = 0,
  sourceTop = 0,
): Rect {
  const thisAr = Math.abs(sourceWidth / sourceHeight);
  const fitAr = Math.abs(fitAspectRatio);
  if (thisAr === 0 || fitAr === 0) return Rect.zero;

  const isFullWidth = fitAr > thisAr;
  const width = isFullWidth ? sourceWidth : sourceHeight * fitAr;
  const height = isFullWidth ? sourceWidth / fitAr : sourceHeight;

  return (isFullWidth)
    ? Rect.create(sourceLeft, sourceTop + (sourceHeight - height) / 2, width, height)
    : Rect.create(sourceLeft + (sourceWidth - width) / 2, sourceTop, width, height);
}

Vector.prototype.fit = function fit(this, targetSize) {
  return fitAspectRatio(this.width, this.height, Vector.getAspectRatio(targetSize));
};

Vector.prototype.toRect = function toRect(this) {
  return Rect.create(0, 0, this.width, this.height);
};

Rect.prototype.fit = function fit(this, targetSize) {
  return fitAspectRatio(this.width, this.height, Vector.getAspectRatio(targetSize), this.left, this.top);
};

Rect.prototype.toVector = function toRect(this) {
  return Vector.create(this.width, this.height);
};
