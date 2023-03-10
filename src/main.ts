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
  _colliding: boolean = false;
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
    let color = this.color;
    if (this._colliding) {
      color = "green";
      this._colliding = false;
    }
    this.x += x;
    this.y += y;
    this.ctx.fillStyle = color;
    this.draw();
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x + this.width, this.y);
    this.ctx.lineTo(this.x + this.width, this.y + this.width);
    this.ctx.lineTo(this.x, this.y + this.width);
    this.ctx.lineTo(this.x, this.y);
    this.ctx.fill()




    this.ctx.fillRect(this.x, this.y, this.width, this.width);
  }
}

class PhysicEnviroment {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  gravityAcceleration: number;
  _pobjects: Array<Rect>;
  drawVectors: boolean;
  _num_of_objects: number;
  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    gravityAcceleration: number = 10,
    drawVectors: boolean = false
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.gravityAcceleration = gravityAcceleration;
    this._pobjects = [];
    this.drawVectors = drawVectors;
    this._num_of_objects = 0;
  }

  areCollidingX(pobj1: Rect, pobj2: Rect) {
    // Check if the squares are actually on the common height (y axis)
    const doesOverlapY1: boolean =
      (pobj1.width + pobj1.y > pobj2.y && pobj2.y >= pobj1.y) ||
      (pobj2.width + pobj2.y <= pobj1.y + pobj1.width &&
        pobj2.y + pobj2.width > pobj1.y);

    const doesOverlapY2: boolean =
      (pobj2.width + pobj2.y > pobj1.y && pobj1.y >= pobj2.y) ||
      (pobj1.width + pobj1.y <= pobj2.y + pobj2.width &&
        pobj1.y + pobj1.width > pobj2.y);

    const doesOverlap = doesOverlapY1 || doesOverlapY2;


    // Check if the objects collide on the x axis
    const doesCollideX1: boolean =
      pobj1.x <= pobj2.x && pobj1.x + pobj1.width >= pobj2.x;

    const doesCollideX2: boolean =
      pobj1.x <= pobj2.width + pobj2.x &&
      pobj1.x + pobj1.width >= pobj2.x + pobj2.width;

    const doesColllideX3: boolean =
      pobj1.x <= pobj2.x && pobj2.x + pobj2.width <= pobj1.x + pobj1.width;

    const doesColllideX4: boolean =
      pobj2.x <= pobj1.x && pobj1.x + pobj1.width <= pobj2.x + pobj2.width;

    return (doesCollideX1 || doesCollideX2 || doesColllideX3 || doesColllideX4) && doesOverlap;
  }

  areCollidingY(pobj1: Rect, pobj2: Rect) {
    
  }


  setVectosWalls(pobj: Rect) {
    if (pobj.x >= this.width - pobj.width || pobj.x <= 0) {
      pobj.vel_x *= -0.7;

      // VEL_X *= -1
    }

    if (pobj.y <= 0 || pobj.y + pobj.width >= this.height) {
      pobj.vel_y *= -0.7;
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
        element.vel_y += (interval / 1000) * this.gravityAcceleration;

        this.setVectosWalls(element);

        // if (this.areCollidingX(this._pobjects[0], this._pobjects[1])) {
        //   this._pobjects[0]._colliding = true;
        //   this._pobjects[1]._colliding = true;


        //   console.log("colliding");
        // }
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
