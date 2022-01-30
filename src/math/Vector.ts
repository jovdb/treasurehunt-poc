import { areSimilar } from "./Number";

/** Represents a displacement */
export interface IVector {
  width: number;
  height: number;
}

export class Vector {
  private constructor(public width: number, public height: number) {
    // Empty
  }

  static create = (width: number, height: number) => new this(width, height);

  static zero = new this(0, 0);

  static one = new this(1, 1);

  static fromTuple = (vector: [width: number, height: number]) => new this(vector[0], vector[1]);

  static fromObject = (vector: IVector) => (vector instanceof Vector ? vector : new this(vector.width, vector.height));

  /** Create a unit Vector from an angle */
  static fromAngleRad(rad: number) {
    return Vector.create(
      Math.cos(rad),
      -Math.sin(rad),
    );
  }

  /** Create a unit Vector from an angle */
  static fromAngleDeg(deg: number) {
    return this.fromAngleRad((deg * 180) / Math.PI);
  }

  /** Returns that absolute aspectRatio, 0 when width or height are 0 */
  static getAspectRatio = (vector: IVector) => (vector.width && vector.height ? Math.abs(vector.width / vector.height) : 0);

  /** Compare the values of 2 rects */
  static areSimilar(vector1: IVector, vector2: IVector, epsilon = 1e-6) {
    if (!areSimilar(vector1.width, vector2.width, epsilon)) return false;
    if (!areSimilar(vector1.height, vector2.height, epsilon)) return false;
    return true;
  }

  /** Compare the values of 2 vectors */
  public areSimilar(vector: IVector, epsilon = 1e-6) {
    return Vector.areSimilar(this, vector, epsilon);
  }

  public getLength() {
    return Math.sqrt(this.width * this.width + this.height * this.height);
  }

  /**
   * 0: starts at 3' o clock and goes counter clockwise
   * The result will range from -PI to + PI
   */
  public getAngleRad() {
    return Math.atan2(-this.height, this.width); // First y!
  }

  public getAngleDeg() {
    return (this.getAngleRad() * 180) / Math.PI;
  }

  /** Returns that absolute aspectRatio, 0 when width or height are 0 */
  public getAspectRatio() {
    return Vector.getAspectRatio(this);
  }

  /** Normalize to a unit vector (a vector with length 1) */
  public normalize() {
    const length = this.getLength();
    return this.scale(1 / length);
  }

  /** Scale by a value */
  public inverse() {
    return Vector.create(1 / this.width, 1 / this.height);
  }

  /** Scale by a value */
  public scale(scaleX: number, scaleY = scaleX) {
    return Vector.create(this.width * scaleX, this.height * scaleY);
  }

  /** Multiply 2 vectors */
  public scaleByVector(vector: Vector) {
    return Vector.create(this.width * vector.width, this.height * vector.height);
  }

  public toTuple(): [width: number, height: number] {
    return [this.width, this.height];
  }

  public toObject() {
    return { width: this.width, height: this.height };
  }

  public toString() {
    return `vector(${this.width}, ${this.height})`;
  }
}
