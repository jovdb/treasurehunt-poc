import { Transform } from "./Transform";

describe("Transform", () => {
  it("create", () => {
    const result = Transform.create(1, 2, 3, 4, 5, 6);
    expect(result).toEqual(Transform.create(1, 2, 3, 4, 5, 6));
  });

  it("should serialize to a plain oject", () => {
    // This should allow us to store it in for example redux state
    const result = Transform.create(1, 2, 3, 4, 5, 6);
    expect(JSON.stringify(result)).toEqual(JSON.stringify({
      a: 1, b: 2, c: 3, d: 4, e: 5, f: 6,
    }));
  });

  it("identity", () => {
    const result = Transform.identity;
    expect(result).toEqual(Transform.create(1, 0, 0, 1, 0, 0));
  });

  describe("areSimilar", () => {
    it("should be the same", () => {
      const m1 = Transform.create(1, 2, 3, 4, 5, 6);
      const m2 = Transform.create(1, 2, 3, 4, 5, 6);
      const result = m1.areSimilar(m2);
      expect(result).toBeTruthy();
    });

    it("should be different", () => {
      const m1 = Transform.create(1, 2, 3, 4, 5, 6);
      const m2 = Transform.create(1, 2, 4, 4, 5, 6);
      const result = m1.areSimilar(m2);
      expect(result).toBeFalsy();
    });
  });

  it("translate", () => {
    const result = Transform.translate(3, 5);
    expect(result).toEqual(Transform.create(1, 0, 0, 1, 3, 5));
  });

  describe("scale", () => {
    it("scale(x)", () => {
      const result = Transform.scale(3);
      expect(result).toEqual(Transform.create(3, 0, 0, 3, 0, 0));
    });

    it("scale(x, y)", () => {
      const result = Transform.scale(3, 5);
      expect(result).toEqual(Transform.create(3, 0, 0, 5, 0, 0));
    });
  });

  describe("rotate", () => {
    it("rotate(0) = identity", () => {
      const result1 = Transform.rotateByDeg(0);
      expect(result1.areSimilar(Transform.identity)).toBeTruthy();

      const result2 = Transform.rotateByRad(0);
      expect(result2.areSimilar(Transform.identity)).toBeTruthy();
    });

    it("rotateByDeg(90)", () => {
      const result = Transform.rotateByDeg(90);
      expect(result.areSimilar(Transform.create(0, 1, -1, 0, 0, 0))).toBeTruthy();
    });

    it("rotateByDeg(60)", () => {
      const result = Transform.rotateByDeg(60);
      expect(result.areSimilar(Transform.create(0.5, 0.866025, -0.866025, 0.5, 0, 0))).toBeTruthy(); // From DOM: rotate(60deg) = 'matrix(0.5, 0.866025, -0.866025, 0.5, 0, 0)'
    });
  });

  describe("multiply", () => {
    it("0 args", () => {
      const result = Transform.multiply();
      expect(result).toEqual(Transform.identity);
    });

    it("1 args", () => {
      const result = Transform.multiply(Transform.create(1, 2, 3, 4, 5, 6));
      expect(result).toEqual(Transform.create(1, 2, 3, 4, 5, 6));
    });

    it("2 args: translate + scale", () => {
      const result = Transform.multiply(
        Transform.translate(2, 3),
        Transform.scale(2, 3),
      );
      expect(result).toEqual(Transform.create(2, 0, 0, 3, 4, 9));
    });

    it("2 args: scale + translate", () => {
      const result = Transform.multiply(
        Transform.scale(2, 3),
        Transform.translate(2, 3),
      );
      expect(result).toEqual(Transform.create(2, 0, 0, 3, 2, 3));
    });

    it("3 args", () => {
      const result = Transform.multiply(
        Transform.translate(2, 3),
        Transform.scale(2, 3),
        Transform.translate(5, 7),
      );
      expect(result).toEqual(Transform.create(2, 0, 0, 3, 9, 16));
    });

    it("rotateByDeg(60) * rotateByDeg(30) = rotateByDeg(90)", () => {
      const result = Transform.multiply(
        Transform.rotateByDeg(60),
        Transform.rotateByDeg(30),
      );
      expect(result.areSimilar(Transform.rotateByDeg(90))).toBeTruthy();
    });
  });

  describe("toTransform", () => {
    it("identity -> scale(2, 3)", () => {
      const result = Transform.identity.toTransform(Transform.scale(2, 3));
      expect(result).toEqual(Transform.scale(2, 3));
    });

    it("scale(2, 3) -> scale(4, 4)", () => {
      const result = Transform.scale(2, 3).toTransform(Transform.scale(4, 4));
      expect(result).toEqual(Transform.scale(2, 4 / 3));
    });

    it("translate(2, 3) -> translate(4, 4)", () => {
      const result = Transform.translate(2, 3).toTransform(Transform.translate(4, 4));
      expect(result).toEqual(Transform.translate(2, 1));
    });

    it("translate(2, 3) -> scale(2, 3)", () => {
      const result = Transform.translate(2, 3).toTransform(Transform.scale(2, 3));
      expect(result).toEqual(Transform.translate(-2, -3).scale(2, 3));
    });
  });

  describe("inverse", () => {
    it("of identity should be identity", () => {
      const result = Transform.identity.inverse();
      expect(result.toString()).toEqual(Transform.identity.toString());
    });

    it("T * T-1 = identity", () => {
      const transform = Transform.scale(2, 3).translate(4, 5);
      const result = transform.multiply(transform.inverse());
      expect(result.areSimilar(Transform.identity)).toBeTruthy();
    });
  });
});
