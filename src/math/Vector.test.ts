import { Vector } from "./Vector";

describe("Vector", () => {
  it("create", () => {
    const vector = Vector.create(1, 2);
    expect(vector.width).toBe(1);
    expect(vector.height).toBe(2);
  });

  it("should serialize to a plain oject", () => {
    // This should allow us to store it in for example redux state
    const result = Vector.create(3, 4);
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ width: 3, height: 4 }));
  });

  it("toTuple", () => {
    const result = Vector.create(1, 2).toTuple();
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
  });

  it("getAngleRad", () => {
    // 3' o clock
    let rad = Vector.create(2, 0).getAngleRad();
    expect(Math.abs(rad)).toBe(0); // -0

    // 12' o clock
    rad = Vector.create(0, -2).getAngleRad();
    expect(rad).toBe(Math.PI * 0.5);

    // 9' o clock
    rad = Vector.create(-2, 0).getAngleRad();
    expect(Math.abs(rad)).toBe(Math.PI * 1);

    // 6' o clock
    rad = Vector.create(0, 2).getAngleRad();
    expect(rad).toBe(-Math.PI * 0.5);
  });

  it("fromAngleRad", () => {
    // 3' o clock
    let v = Vector.fromAngleRad(0);
    expect(v.areSimilar(Vector.create(1, 0))).toBeTruthy();

    // 12' o clock
    v = Vector.fromAngleRad(Math.PI * 0.5);
    expect(v.areSimilar(Vector.create(0, -1))).toBeTruthy();

    // 9' o clock
    v = Vector.fromAngleRad(Math.PI * 1);
    expect(v.areSimilar(Vector.create(-1, 0))).toBeTruthy();

    // 6' o clock
    v = Vector.fromAngleRad(Math.PI * 1.5);
    expect(v.areSimilar(Vector.create(0, 1))).toBeTruthy();
  });

  it("getAngleDeg", () => {
    // 3' o clock
    let deg = Vector.create(2, 0).getAngleDeg();
    expect(Math.abs(deg)).toBe(0); // -0

    // 12' o clock
    deg = Vector.create(0, -2).getAngleDeg();
    expect(deg).toBe(90);

    // 9' o clock
    deg = Vector.create(-2, 0).getAngleDeg();
    expect(Math.abs(deg)).toBe(180);

    // 6' o clock
    deg = Vector.create(0, 2).getAngleDeg();
    expect(deg).toBe(-90);
  });
});
