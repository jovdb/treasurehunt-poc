// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

import { Rect, IRect } from "../Rect";
import { Transform } from "../Transform";

declare module "../Rect" {
  interface Rect {
    /** Apply transform on this rectangle */
    transform(this: Rect, transform: Transform): Rect;

    /** Get the transform from this rect to the targetRect */
    toRectTransform(this: Rect, targetRect: IRect): Transform;

    /** Get the transform from the targetRect to this rect */
    fromRectTransform(this: Rect, targetRect: IRect): Transform;
  }
}

declare module "../Transform" {
  interface Transform {
    applyToRect(this: Transform, rect: Rect): Rect;
  }
}

Rect.prototype.transform = function transform(this, transform) {
  const [left, top] = Transform.transform(transform, this.left, this.top);
  const [width, height] = Transform.transform(transform, this.width, this.height, 0); // w=0 ignore translations
  return Rect.create(left, top, width, height);
};

Rect.prototype.toRectTransform = function toRectTransform(this, rect) {
  return Transform
    .scale(rect.width / this.width, rect.height / this.height)
    .translate(rect.left - this.left, rect.top - this.top);
};

Rect.prototype.fromRectTransform = function fromRectTransform(this, rect) {
  return this.toRectTransform(rect).inverse();
};

Transform.prototype.applyToRect = function applyToRect(this, rect) {
  const [left, top] = Transform.transform(this, rect.left, rect.top);
  const [width, height] = Transform.transform(this, rect.width, rect.height, 0); // w=0 ignore translations
  return Rect.create(left, top, width, height);
};
