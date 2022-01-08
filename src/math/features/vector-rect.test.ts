import { Rect } from "../Rect";
import { Vector } from "../Vector";
import "./vector-rect";

describe("vector-rect", () => {
  describe("fit", () => {
    it("vector(1,4) in vector(1/2)", () => {
      // ┌──┬────┬──┐
      // │  │    │  │
      // │1 │ 1  │  │
      // │/ │ /  │  │
      // │2 │ 4  │  │
      // │  │    │  │
      // └──┴────┴──┘
      const fitIn = Vector.create(32, 64); // 1/2
      const toFit = Vector.create(4, 16); // 1/4
      const result = fitIn.fit(toFit);
      expect(result.toObject()).toEqual(Rect.create(8, 0, 16, 64).toObject());
    });

    it("vector(4/1) in vector(1/2)", () => {
      // ┌──────────┐
      // │   1/2    │
      // ├──────────┤
      // │   4/1    │
      // ├──────────┤
      // │          │
      // └──────────┘
      const fitIn = Vector.create(32, 64); // 1/2
      const toFit = Vector.create(16, 4); // 4/1
      const result = fitIn.fit(toFit);
      expect(result.toObject()).toEqual(Rect.create(0, 28, 32, 8).toObject());
    });

    it("vector(1,4) in vector(2/1)", () => {
      // ┌─────┬───────┬─────┐
      // │ 2/1 │  1/4  │     │
      // │     │       │     │
      // │     │       │     │
      // │     │       │     │
      // └─────┴───────┴─────┘
      const fitIn = Vector.create(64, 32); // 2/1
      const toFit = Vector.create(4, 16); // 1/4
      const result = fitIn.fit(toFit);
      expect(result.toObject()).toEqual(Rect.create(28, 0, 8, 32).toObject());
    });

    it("vector(4/1) in vector(2/1)", () => {
      // ┌───────────────────┐
      // │        2/1        │
      // ├───────────────────┤
      // │        4/1        │
      // ├───────────────────┤
      // │                   │
      // └───────────────────┘
      const fitIn = Vector.create(64, 32); // 2/1
      const toFit = Vector.create(16, 4); // 4/1
      const result = fitIn.fit(toFit);
      expect(result.toObject()).toEqual(Rect.create(0, 8, 64, 16).toObject());
    });
  });
});
