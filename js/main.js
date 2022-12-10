"use strict";


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';


let x = 0
let VEL_X = 10
let VEL_Y = 3
let fps = 600

let timeout = 1000

const WIDTH = 1000
const HEIGHT = 700



class Rect {
    constructor(x, y, vel_x, vel_y, width, color, ctx) {

        // Ctx should be never set by user, it is set by the physics enviroment itself
        this.x = x
        this.y = y
        this.vel_x = vel_x
        this.vel_y = vel_y
        this.width = width
        this.color = color
        this.ctx = ctx
        this._temp_vel_y = 0;
        this._temp_vel_x = 0;


    }

    update(x, y) {
        this.x += x
        this.y += y
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.x, this.y, this.width, this.width)
    }

    draw() {
        this.ctx.fillRect(this.x, this.y, this.width, this.width);

    }
}



class PhysicEnviroment {
    constructor(ctx, width, height, drawVectors = false) {
        this.ctx = ctx
        this.width = width
        this.height = height
        this._pobjets = []
        this.drawVectors = drawVectors
        this._num_of_objects = 0

    }

    collisionInNextFrameX(pobj1, pobj2) {
        let next_x1 = pobj1.x + pobj1.vel_x;
        let next_x2 = pobj2.x + pobj2.vel_x;
        let delta = Math.abs(next_x1 - next_x2)

        if ((delta <= pobj1.vel_x) || delta <= pobj2.vel_x) {
            return [true, delta]
        }

        return [false, 0];
    }

    setVectosWalls(pobj) {
        if (pobj.x >= this.width - pobj.width || pobj.x <= 0) {
            pobj.vel_x *= -1

            // VEL_X *= -1
        }


        if (pobj.y <= 0 || pobj.y + pobj.width >= this.height) {
            pobj.vel_y *= - 1
            // VEL_Y *= -1
        }


        pobj.update(pobj.vel_x, pobj.vel_y)

    }


    drawVector(pobj, vector_scale = 3) {
        const [x, y] = [pobj.x + pobj.width / 2, pobj.y + pobj.width / 2]

        // const length = Math.sqrt(x^2 + y^2)s
        ctx.fillStyle = "black";
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, 2 * Math.PI)
        ctx.fill()


        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.moveTo(x, y)
        // console.log(x, y, pobj.vel_x + x, pobj.vel_y + y)
        let first = (x + pobj.vel_x * vector_scale)
        let second = (y + pobj.vel_y * vector_scale)

        // console.log(first, second, first * 2, second * 2)
        ctx.lineWidth = 5
        ctx.lineTo(first, second
            )
        ctx.stroke()
            
        ctx.moveTo(first, second)
        ctx.fillStyle = "blue"
        ctx.arc(first, second, 7, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fill()
    }

    loop(interval=10) {
        setInterval(() => {
            this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
        
        
            this._pobjets.forEach((element, index) => {
                this.ctx.fillStyle = element.color
                
       

                this.setVectosWalls(element)
                let [collision, delta] = this.collisionInNextFrameX(this._pobjets[0], this._pobjets[1])
                if (collision) {
                    console.log("collision");
                    this._pobjets[0].vel_x *= -1;
                    this._pobjets[1].vel_x *= -1;


                }
                if (this.drawVectors) {
                    this.drawVector(element)

                }
        
        
            });
        
        
        
        }, interval)
        
        
    }

    addObject(pobj) {

        this._pobjets.push(pobj)
        this._num_of_objects += 1;
    }

}



let rectangle = new Rect(5, 5, 10, 3, 60, "red",ctx)

let physics = new PhysicEnviroment(ctx, WIDTH, HEIGHT)


