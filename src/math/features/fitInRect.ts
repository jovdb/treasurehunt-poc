import { Rect } from "../Rect";
import { Transform } from "../Transform";
import "./transformRect";

/** Calculate a transform to center and scale a size or rectangle in another rectangle */
export function getFitInRectTransform(
  fitInRect: Rect,
  rectToFit: Rect,
) {
  const normalizedRect = rectToFit.normalize();
  const childRatio = normalizedRect.width / normalizedRect.height;
  const containerRatio = fitInRect.width / fitInRect.height;

  let scaleBy = 1;
  let x = 0;
  let y = 0;

  const { left, top } = normalizedRect;

  if (childRatio > containerRatio) {
    const childScaledHeight = (fitInRect.width / childRatio);
    scaleBy = fitInRect.width / normalizedRect.width;
    x = fitInRect.left - left * scaleBy;
    y = fitInRect.top + (fitInRect.height - childScaledHeight) / 2 - top * scaleBy;
  } else {
    const childScaledWidth = (fitInRect.height * childRatio);
    scaleBy = fitInRect.height / normalizedRect.height;
    x = fitInRect.left + (fitInRect.width - childScaledWidth) / 2 - left * scaleBy;
    y = fitInRect.top - top * scaleBy;
  }

  return Transform
    .scale(scaleBy)
    .translate(x, y);
}

declare module "../Rect" {
  interface Rect {
    fitRectTransform(this: Rect, rectToFit: Rect): Transform;
    fitRect(this: Rect, rectToFit: Rect): Rect;
  }
}

Rect.prototype.fitRectTransform = function getFitTransform(this, rectToFit) {
  return getFitInRectTransform(this, rectToFit);
};

Rect.prototype.fitRect = function fitRect(this, rectToFit) {
  return getFitInRectTransform(this, rectToFit)
    .applyToRect(rectToFit);
};

// TODO: move to math
// transform with w arg: (skip transform)
// Add Vector
