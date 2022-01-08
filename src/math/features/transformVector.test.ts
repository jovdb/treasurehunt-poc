import { Transform } from "../Transform";
import { Vector } from "../Vector";
import "./transformVector";

describe("transformVector", () => {
  describe("Vector.transform", () => {
    it("with identity", () => {
      const vector = Vector.create(2, 3);
      const transform = Transform.identity;
      const result = vector.transform(transform);
      expect(result.toTuple()).toEqual(vector.toTuple());
    });

    it("with scale(2)", () => {
      const vector = Vector.create(2, 3);
      const transform = Transform.scale(2);
      const result = vector.transform(transform);
      expect(result.toTuple()).toEqual([4, 6]);
    });

    it("with scale(-1)", () => {
      const vector = Vector.create(2, 3);
      const transform = Transform.scale(-1);
      const result = vector.transform(transform);
      expect(result.toTuple()).toEqual([-2, -3]);
    });

    it("with translate(3, -4)", () => {
      const vector = Vector.create(2, 3);
      const transform = Transform.translate(3, -4);
      const result = vector.transform(transform);
      expect(result.toTuple()).toEqual([2, 3]); // Vectors have no position so translate should be ignored
    });

    it("with translate(3, -4).scale(2)", () => {
      const vector = Vector.create(2, 3);
      const transform = Transform
        .translate(3, -4)
        .scale(2);
      const result = vector.transform(transform);
      expect(result.toTuple()).toEqual([4, 6]);
    });

    it("with .scale(2, -1).translate(3, -4)", () => {
      const vector = Vector.create(2, 3);
      const transform = Transform
        .scale(2, -1)
        .translate(3, -4);
      const result = vector.transform(transform);
      expect(result.toTuple()).toEqual([4, -3]);
    });
  });

  it("Transform.translateByVector", () => {
    const vector = Vector.create(2, 3);
    const transform = Transform.identity.translateByVector(vector);
    expect(transform.toCssMatrix()).toEqual("matrix(1, 0, 0, 1, 2, 3)");
  });

  it("Transform.scaleByVector", () => {
    const vector = Vector.create(2, 3);
    const transform = Transform.identity.scaleByVector(vector);
    expect(transform.toCssMatrix()).toEqual("matrix(2, 0, 0, 3, 0, 0)");
  });

  xit("Transform.rotateByVector", () => {
    const vector = Vector.create(2, 3);
    const transform = Transform.identity.rotateByVector(vector);
    const rad = Math.atan2(vector.height, vector.width);
    expect(transform.toCssMatrix()).toEqual(`matrix(${Math.cos(rad)}, ${Math.sin(rad)}, -${Math.sin(rad)}, ${Math.cos(rad)}, 0, 0)`);
  });
});
