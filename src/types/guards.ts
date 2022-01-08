/**
 * A Way to create tagged (primitive) types. (also known as Opaque or Nominal Types)
 * Example:
 * type GuidString = string & OfType<"GuidString">;
 * namespace GuidString {
 *     validate(guid: string | null | undefined): guid is GuidString {
 *         return typeof guid === "string" && guid.length === 32;
 *     }
 * }
 * This is mainly used to ensure that the format is correct.
 * This prevents that a function needs to check the type,
 * it forces type checks to the boundaries (outer layer) of the application.
 */
export interface OfType<T extends string> { [type: string]: T }

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isNumber(value: any): value is number {
  return typeof value === "number";
}
