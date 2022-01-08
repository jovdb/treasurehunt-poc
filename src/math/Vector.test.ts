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
});
