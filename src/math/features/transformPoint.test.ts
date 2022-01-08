import { Transform } from "../Transform";
import { Point } from "../Point";
import "./transformPoint";

describe("transformPoint", () => {
  it("identity", () => {
    const result = Point.create(1, 2).transform(Transform.identity);
    expect(result.left).toBe(1);
    expect(result.top).toBe(2);
  });

  it("scale", () => {
    const result = Point.create(1, 2).transform(Transform.scale(2, 3));
    expect(result.left).toBe(2);
    expect(result.top).toBe(6);
  });

  it("translate", () => {
    const result = Point.create(1, 2).transform(Transform.translate(5, 7));
    expect(result.left).toBe(6);
    expect(result.top).toBe(9);
  });
});
