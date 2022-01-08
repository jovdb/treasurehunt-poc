import { Point } from "./Point";
import { Rect } from "./Rect";

describe("Rect", () => {
  it("create", () => {
    const result = Rect.create(1, 2, 3, 4);
    expect(result.left).toEqual(1);
    expect(result.top).toEqual(2);
    expect(result.width).toEqual(3);
    expect(result.height).toEqual(4);
  });

  it("zero", () => {
    const result = Rect.zero;
    expect(result.toTuple()).toEqual([0, 0, 0, 0]);
  });

  it("should serialize to a plain oject", () => {
    // This should allow us to store it in for example redux state
    const result = Rect.create(1, 2, 3, 4);
    expect(JSON.stringify(result)).toEqual(JSON.stringify({
      left: 1, top: 2, width: 3, height: 4,
    }));
  });

  describe("areSimilar", () => {
    it("should be the same", () => {
      const r1 = Rect.create(1, 2, 3, 4);
      const r2 = Rect.create(1, 2.00000001, 3.0000002, 4);
      const result = r1.areSimilar(r2);
      expect(result).toBeTruthy();
    });

    it("should be different", () => {
      const r1 = Rect.create(1, 2, 3, 4);
      const r2 = Rect.create(1, 2, 3.0001, 4);
      const result = r1.areSimilar(r2);
      expect(result).toBeFalsy();
    });
  });

  it("getCenter", () => {
    const result = Rect.create(2, 4, 6, 8).getCenter();
    expect(result).toEqual({ left: 5, top: 8 });
  });

  describe("fromPoints", () => {
    it("0 points", () => {
      const points = [];
      expect(() => Rect.fromPoints(points)).toThrow();
    });
    it("1 point", () => {
      const points = [
        Point.create(1, 2),
      ];
      const result = Rect.fromPoints(points);
      expect(result.toTuple()).toEqual([1, 2, 0, 0]);
    });
    it("2 points", () => {
      const points = [
        Point.create(1, 3),
        Point.create(-2, -1),
      ];
      const result = Rect.fromPoints(points);
      expect(result.toTuple()).toEqual([-2, -1, 3, 4]);
    });
    it("3 points", () => {
      const points = [
        Point.create(1, 2),
        Point.create(3, 1),
        Point.create(3, 4),
      ];
      const result = Rect.fromPoints(points);
      expect(result.toTuple()).toEqual([1, 1, 2, 3]);
    });
  });

  describe("normalize", () => {
    it("with normal rect", () => {
      const rect = Rect.create(1, 2, 3, 4);
      expect(rect.normalize().toTuple()).toEqual(rect.toTuple());
    });

    it("with negative width rect", () => {
      const rect = Rect.create(1, 2, -3, 4);
      expect(rect.normalize().toTuple()).toEqual([-2, 2, 3, 4]);
    });

    it("with negative height rect", () => {
      const rect = Rect.create(1, 2, 3, -4);
      expect(rect.normalize().toTuple()).toEqual([1, -2, 3, 4]);
    });
  });
});
