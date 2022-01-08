import { Rect } from "./Rect";
import { Transform } from "./Transform";

Transform
  .translate(4, 3)
  .applyToRect(Rect.create(1, 2, 3, 4))
  .getCenter()
  .transform(Transform.scale(2))
  .toTuple();
