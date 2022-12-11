let canvas: HTMLElement | null = document.querySelector("canvas");

if (!canvas) {
  canvas = document.createElement("canvas");
  const root: HTMLBodyElement | null = document.querySelector("body");
  if (root) {
      root.appendChild(canvas);
  }
}
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
const fillStyle: string = "green";

ctx.fillStyle = fillStyle;

let x: number = 0;
let VEL_X: number = 10;
let VEL_Y: number = 3;
let fps: number = 600;

let timeout: number = 1000;

const WIDTH: number = 1000;
const HEIGHT: number = 700;

class Rect {
  x: number;
  y: number;
  vel_x: number;
  vel_y: number;
  width: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  _temp_vel_y: number;
  _temp_vel_x: number;
  constructor(
    x: number,
    y: number,
    vel_x: number,
    vel_y: number,
    width: number,
    color: string,
    ctx: CanvasRenderingContext2D
  ) {
    // Ctx should be never set by user, it is set by the physics enviroment itself
    this.x = x;
    this.y = y;
    this.vel_x = vel_x;
    this.vel_y = vel_y;
    this.width = width;
    this.color = color;
    this.ctx = ctx;
    this._temp_vel_y = 0;
    this._temp_vel_x = 0;
  }

  update(x: number, y: number) {
    this.x += x;
    this.y += y;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.width);
  }

  draw() {
    this.ctx.fillRect(this.x, this.y, this.width, this.width);
  }
}

class PhysicEnviroment {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  _pobjects: Array<Rect>;
  drawVectors: boolean;
  _num_of_objects: number;
  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    drawVectors: boolean = false
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this._pobjects = [];
    this.drawVectors = drawVectors;
    this._num_of_objects = 0;
  }

  collisionInNextFrameX(pobj1: Rect, pobj2: Rect) {
    let next_x1 = pobj1.x + pobj1.vel_x;
    let next_x2 = pobj2.x + pobj2.vel_x;
    let delta = Math.abs(next_x1 - next_x2);

    if (delta <= pobj1.vel_x || delta <= pobj2.vel_x) {
      return [true, delta];
    }

    return [false, 0];
  }

  setVectosWalls(pobj: Rect) {
    if (pobj.x >= this.width - pobj.width || pobj.x <= 0) {
      pobj.vel_x *= -1;

      // VEL_X *= -1
    }

    if (pobj.y <= 0 || pobj.y + pobj.width >= this.height) {
      pobj.vel_y *= -1;
      // VEL_Y *= -1
    }

    pobj.update(pobj.vel_x, pobj.vel_y);
  }

  drawVector(pobj: Rect, vector_scale: number = 3) {
    const [x, y] = [pobj.x + pobj.width / 2, pobj.y + pobj.width / 2];

    // const length = Math.sqrt(x^2 + y^2)s
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(x, y);
    // console.log(x, y, pobj.vel_x + x, pobj.vel_y + y)
    let first = x + pobj.vel_x * vector_scale;
    let second = y + pobj.vel_y * vector_scale;

    // console.log(first, second, first * 2, second * 2)
    ctx.lineWidth = 5;
    ctx.lineTo(first, second);
    ctx.stroke();

    ctx.moveTo(first, second);
    ctx.fillStyle = "blue";
    ctx.arc(first, second, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }

  loop(interval: number = 10) {
    setInterval(() => {
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

      this._pobjects.forEach((element, index) => {
        this.ctx.fillStyle = element.color;

        this.setVectosWalls(element);
        let [collision, delta] = this.collisionInNextFrameX(
          this._pobjects[0],
          this._pobjects[1]
        );
        if (collision) {
          console.log("collision");
          this._pobjects[0].vel_x *= -1;
          this._pobjects[1].vel_x *= -1;
        }
        if (this.drawVectors) {
          this.drawVector(element);
        }
      });
    }, interval);
  }

  addObject(pobj: Rect) {
    this._pobjects.push(pobj);
    this._num_of_objects += 1;
  }
}

let rectangle = new Rect(5, 5, 10, 3, 60, "red", ctx);

let physics = new PhysicEnviroment(ctx, WIDTH, HEIGHT);
