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

  static fromObject = (vector: IVector) => (vector instanceof Vector ? vector : new this(vector.width, vector.height));

  /** Returns that absolute aspectRatio, 0 when width or height are 0 */
  static getAspectRatio = (vector: IVector) => (vector.width && vector.height ? Math.abs(vector.width / vector.height) : 0);

  public getLength() {
    return Math.sqrt(this.width * this.width + this.height * this.height);
  }

  /** Can we define angle?, we need to agree a start axis */
  public getAngleRad() {
    return Math.atan2(this.height, -this.width);
  }

  public getAngleDeg() {
    return (this.getAngleRad() * 180) / Math.PI;
  }

  /** Returns that absolute aspectRatio, 0 when width or height are 0 */
  public getAspectRatio() {
    return Vector.getAspectRatio(this);
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
