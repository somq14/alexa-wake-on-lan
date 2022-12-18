import { add } from "./index";

describe("add", () => {
  it("zero", () => {
    expect(add(0, 0)).toBe(0);
  });

  it("non zero", () => {
    expect(add(1, 2)).toBe(3);
  });
});
