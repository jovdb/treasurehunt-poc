export function isNumber(value: any): value is number {
  return typeof value === "number";
}

export function areSimilar(n1: number, n2: number, epsilon = 1e-6) {
  return Math.abs(n1 - n2) < epsilon;
}
