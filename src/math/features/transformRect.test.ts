import { Rect } from "../Rect";
import { Transform } from "../Transform";
import "./transformRect";

describe("transformRect", () => {
  describe(".transform", () => {
    it("with identity", () => {
      const rect = Rect.create(2, 4, 6, 8);
      const transform = Transform.identity;
      const result = rect.transform(transform);
      expect(result.toTuple()).toEqual(rect.toTuple());
    });

    it("with scale(2)", () => {
      const rect = Rect.create(2, 4, 6, 8);
      const transform = Transform.scale(2);
      const result = rect.transform(transform);
      expect(result.toTuple()).toEqual([4, 8, 12, 16]);
    });

    it("with scale(-1)", () => {
      const rect = Rect.create(2, 4, 6, 8);
      const transform = Transform.scale(-1);
      const result = rect.transform(transform);
      expect(result.toTuple()).toEqual([-2, -4, -6, -8]);
    });

    it("with translate(3, -4)", () => {
      const rect = Rect.create(2, 4, 6, 8);
      const transform = Transform
        .translate(3, -4);
      const result = rect.transform(transform);
      expect(result.toTuple()).toEqual([5, 0, 6, 8]);
    });

    it("with translate(3, -4).scale(2)", () => {
      const rect = Rect.create(2, 4, 6, 8);
      const transform = Transform
        .translate(3, -4)
        .scale(2);
      const result = rect.transform(transform);
      expect(result.toTuple()).toEqual([10, 0, 12, 16]);
    });

    it("with .scale(2, -1)translate(3, -4)", () => {
      const rect = Rect.create(2, 4, 6, 8);
      const transform = Transform
        .scale(2, -1)
        .translate(3, -4);
      const result = rect.transform(transform);
      expect(result.toTuple()).toEqual([7, -8, 12, -8]);
    });
  });

  describe(".toRectTransform", () => {
    it("same rectangle", () => {
      const fromRect = Rect.create(2, 4, 6, 8);
      const toRect = Rect.create(2, 4, 6, 8);
      const result = fromRect.toRectTransform(toRect);
      expect(result.applyToRect(fromRect).toString()).toEqual(toRect.toString());
    });

    it("translate", () => {
      const fromRect = Rect.create(0, 0, 6, 8);
      const toRect = Rect.create(2, 4, 6, 8);
      const result = fromRect.toRectTransform(toRect);
      expect(result.applyToRect(fromRect).toString()).toEqual(toRect.toString());
    });

    it("scale", () => {
      const fromRect = Rect.create(0, 0, 6, 8);
      const toRect = Rect.create(0, 0, 12, 16);
      const result = fromRect.toRectTransform(toRect);
      expect(result.applyToRect(fromRect).toString()).toEqual(toRect.toString());
    });

    it("transform + scale", () => {
      const fromRect = Rect.create(0, 0, 6, 8);
      const toRect = Rect.create(1, 2, -12, 16);
      const result = fromRect.toRectTransform(toRect);
      expect(result.applyToRect(fromRect).toString()).toEqual(toRect.toString());
    });
  });
});
