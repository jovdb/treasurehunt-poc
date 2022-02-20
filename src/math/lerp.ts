/** Interpolate value */
export function lerp(
  from: number,
  to: number,
  t: number,
  clamp: boolean,
) {
  const result = from + (to - from) * t;
  if (!clamp) return result;
  return from < to
    ? Math.min(to, Math.max(from, result))
    : Math.min(from, Math.max(to, result));
}

/** Get the ratio at which the specified value is between the 2 given values */
export function inverseLerp(
  from: number,
  to: number,
  value: number,
  clamp: boolean,
) {
  const result = (value - from) / (to - from);
  return clamp
    ? Math.min(1, Math.max(0, result))
    : result;
}

export function remapRange(
  sourceFrom: number,
  sourceTo: number,
  targetFrom: number,
  targetTo: number,
  value: number,
  clamp: boolean,
) {
  const ratio = inverseLerp(sourceFrom, sourceTo, value, false);
  return lerp(targetFrom, targetTo, ratio, clamp);
}
