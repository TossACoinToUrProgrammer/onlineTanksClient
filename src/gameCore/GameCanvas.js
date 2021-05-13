import GameAnimation from "./GameAnimation"

export default class GameCanvas {
  objects = {}
  constructor(canvas, mapSchema, wallImg) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")

    this.mapSchema = mapSchema
    this.walls = [
      {
        type: "horizontal",
        startX: 0,
        endX: canvas.width,
        startY: canvas.height,
        endY: canvas.height + 50,
      },
      {
        type: "horizontal",
        startX: 0,
        endX: canvas.width,
        startY: -50,
        endY: 0,
      },
      {
        type: "vertical",
        startX: -10,
        endX: 0,
        startY: 0,
        endY: canvas.height,
      },
      {
        type: "vertical",
        startX: canvas.width,
        endX: canvas.width + 10,
        startY: 0,
        endY: canvas.height,
      },
      ...this.mapSchema.walls,
    ]

    this.wallImg = wallImg
    this.animationProvider = new GameAnimation(this.canvas)
  }

  drawWalls() {
    this.canvas.insertAdjacentHTML(
      "afterend",
      `<canvas 
         id="staticCanvas" 
         width="${this.canvas.width}" 
         height="${this.canvas.height}" 
         style="background: url('${this.mapSchema.bgImage}');">
       </canvas>`
    )
    this.staticCtx = document.querySelector("#staticCanvas").getContext("2d")

    this.mapSchema.walls.forEach(this.drawWall.bind(this))
  }

  drawWall(wall) {
    if (wall.type === "horizontal") {
      for (let i = wall.startX; i < wall.endX; i += 35) {
        this.staticCtx.drawImage(this.wallImg, i, wall.startY)
      }
    } else if (wall.type === "vertical") {
      for (let i = wall.startY; i < wall.endY; i += 35) {
        this.staticCtx.drawImage(this.wallImg, wall.startX, i)
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let key in this.objects) {
      this.objects[key].draw()
    }
  }

  addObject(obj) {
    this.objects[obj.id] = obj
  }

  destroyAllObjects() {
    for (let key in this.objects) {
      this.objects[key].destroy()
      delete this.objects[key]
    }
  }

  destroyObject(id) {
    delete this.objects[id]
    this.draw()
  }
}
