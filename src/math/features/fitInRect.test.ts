import { Rect } from "../Rect";
import "./fitInRect";

describe("fitInRect", () => {
  it("with landscape size in portail rect", () => {
    const fitInRect = Rect.create(2, 4, 6, 8);
    const sizeToFit = Rect.create(0, 0, 20, 10);
    const fittedRect = fitInRect.fitRect(sizeToFit);
    expect(fittedRect.toTuple()).toEqual([2, 6.5, 6, 3]);
  });

  xit("with landscape rect in portail rect", () => {
    const fitInRect = Rect.create(2, 4, 6, 8);
    const rectToFit = Rect.create(5, 12, 20, 10);
    const result = fitInRect.fitRectTransform(rectToFit);
    const fittedRect = rectToFit.transform(result);
    expect(fittedRect.toTuple()).toEqual([2, 6.5, 6, 3]);
  });
});
