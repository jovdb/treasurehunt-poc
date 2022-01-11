import { areSimilar } from "./Number";

/*
┌─       ─┐
│ a  c  e │
│ b  d  f │
└─       ─┘
*/

export interface ITransform {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

function multiplyTransform(m1: ITransform, m2: ITransform) {
  /*
  ┌─       ─┐   ┌─       ─┐   ┌─                              ─┐   ┌─                       ─┐
  │ a  c  e │   │ g  i  k │   │ ag+ch+e0   ai+cj+e0   ak+cl+e1 │   │ ag+ch   ai+cj   ak+cl+e │
  │ b  d  f │ * │ h  j  l │ = │ bg+dh+f0   bi+dj+f0   bk+dl+f1 │ = │ bg+dh   bi+dj   bk+dl+f │
  │ 0  0  1 │   │ 0  0  1 │   │ 0g+0h+00   0i+0j+00   0k+0l+11 │   │ 0       0       1       │
  └─       ─┘   └─       ─┘   └─                              ─┘   └─                       ─┘
  */

  // eslint-disable-next-line no-use-before-define
  return Transform.create(
    m1.a * m2.a + m1.c * m2.b,
    m1.b * m2.a + m1.d * m2.b,
    m1.a * m2.c + m1.c * m2.d,
    m1.b * m2.c + m1.d * m2.d,
    m1.a * m2.e + m1.c * m2.f + m1.e,
    m1.b * m2.e + m1.d * m2.f + m1.f,
  );
}

const radToDegFactor = Math.PI / 180;

export class Transform {
  private constructor(
    public readonly a: number,
    public readonly b: number,
    public readonly c: number,
    public readonly d: number,
    public readonly e: number,
    public readonly f: number,
  ) {
    // Empty
  }

  static identity = Transform.create(1, 0, 0, 1, 0, 0);

  static create(a: number, b: number, c: number, d: number, e: number, f: number) {
    return new this(a, b, c, d, e, f);
  }

  static fromObject(obj: ITransform) {
    return Transform.create(obj.a, obj.b, obj.c, obj.d, obj.e, obj.f);
  }

  static translate(x: number, y: number) {
    return Transform.create(1, 0, 0, 1, x, y);
  }

  static scale(scaleX: number, scaleY = scaleX) {
    return Transform.create(scaleX, 0, 0, scaleY, 0, 0);
  }

  /** Rotate clock-wise with radians */
  static rotateByRad(radians: number) {
    const cosAngle = Math.cos(radians);
    const sinAngle = Math.sin(radians);
    return Transform.create(cosAngle, sinAngle, -sinAngle, cosAngle, 0, 0);
  }

  /** Rotate clock-wise with degrees */
  static rotateByDeg(deg: number) {
    return Transform.rotateByRad(deg * radToDegFactor);
  }

  static multiply(...transforms: ITransform[]) {
    if (transforms.length === 0) return Transform.identity;
    if (transforms.length === 1) return transforms[0] instanceof Transform ? transforms[0] : Transform.fromObject(transforms[0]); // TODO: make method?
    if (transforms.length === 2) return multiplyTransform(transforms[1], transforms[0]);
    return transforms.reduceRight((agg, next) => multiplyTransform(agg, next)) as Transform;
  }

  static areSimilar(m1: ITransform, m2: ITransform, epsilon = 1e-6) {
    if (!areSimilar(m1.a, m2.a, epsilon)) return false;
    if (!areSimilar(m1.b, m2.b, epsilon)) return false;
    if (!areSimilar(m1.c, m2.c, epsilon)) return false;
    if (!areSimilar(m1.d, m2.d, epsilon)) return false;
    if (!areSimilar(m1.e, m2.e, epsilon)) return false;
    if (!areSimilar(m1.f, m2.f, epsilon)) return false;
    return true;
  }

  /** Transform a point or vector */
  static transform(
    transform: ITransform,
    x: number,
    y: number,
    /** Use 0 to skip translation (example for vectors) */
    w = 1,
  ): [x: number, y: number] {
    /*
    ┌─       ─┐   ┌─ ─┐
    │ a  c  e │   │ x │
    │ b  d  f │ * │ y │
    └─       ─┘   │ w │
                  └─ ─┘
    */
    return [
      transform.a * x + transform.c * y + transform.e * w,
      transform.b * x + transform.d * y + transform.f * w,
    ];
  }

  static inverse(transform: ITransform) {
    // http://www.wolframalpha.com/input/?i=Inverse+%5B%7B%7Ba,c,e%7D,%7Bb,d,f%7D,%7B0,0,1%7D%7D%5D
    const {
      a, b, c, d, e, f,
    } = transform;
    const denom = a * d - b * c;

    return Transform.create(
      d / denom,
      b / -denom,
      c / -denom,
      a / denom,
      (d * e - c * f) / -denom,
      (b * e - a * f) / denom,
    );
  }

  // Methods
  //--------
  public transform(x: number, y: number) {
    return Transform.transform(this, x, y);
  }

  public translate(x: number, y: number) {
    return this.multiply(
      Transform.translate(x, y),
    );
  }

  public scale(scaleX: number, scaleY = scaleX) {
    return this.multiply(
      Transform.scale(scaleX, scaleY),
    );
  }

  public scaleAt(atX: number, atY: number, scaleX: number, scaleY = scaleX) {
    return this.multiply(
      Transform.translate(atX, atY),
      Transform.scale(scaleX, scaleY),
      Transform.translate(-atX, -atY),
    );
  }

  public rotateByRad(radians: number) {
    const cosAngle = Math.cos(radians);
    const sinAngle = Math.sin(radians);
    return this.multiply(Transform.create(cosAngle, sinAngle, -sinAngle, cosAngle, 0, 0));
  }

  public rotateByDeg(deg: number) {
    return this.multiply(Transform.rotateByRad(deg * radToDegFactor));
  }

  public rotateByDegAt(atX: number, atY: number, deg: number) {
    return this.multiply(
      Transform.translate(atX, atY),
      Transform.rotateByDeg(deg),
      Transform.translate(-atX, -atY),
    );
  }

  public multiply(...transforms: readonly ITransform[]) {
    return Transform.multiply(this, ...transforms);
  }

  public inverse() {
    return Transform.inverse(this);
  }

  /** Calculate the transform to go from this transform to the argument Transform */
  public toTransform(targetTransform: ITransform) {
    // https://stackoverflow.com/a/10176712
    return this.inverse().multiply(targetTransform);
  }

  /** Calculate the transform to go from this target transform to this transform */
  public fromTransform(targetTransform: ITransform) {
    return this.toTransform(targetTransform).inverse();
  }

  public areSimilar(transform: Transform, epsilon = 1e-6) {
    return Transform.areSimilar(this, transform, epsilon);
  }

  public toString() {
    return `transform(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`;
  }

  public toCssMatrix() {
    return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`;
  }

  public toObject() {
    return {
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f,
    };
  }
}
