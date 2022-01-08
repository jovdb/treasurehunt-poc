import { Point } from "./Point";

describe("Point", () => {
  it("create", () => {
    const p = Point.create(1, 2);
    expect(p.left).toBe(1);
    expect(p.top).toBe(2);
  });

  it("should serialize to a plain oject", () => {
    // This should allow us to store it in for example redux state
    const result = Point.create(1, 2);
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ left: 1, top: 2 }));
  });

  it("toTuple", () => {
    const result = Point.create(1, 2).toTuple();
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
  });
});
