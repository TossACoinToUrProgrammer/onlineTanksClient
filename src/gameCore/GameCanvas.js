import GameAnimation from "./GameAnimation"

export default class GameCanvas {
  objects = {}
  constructor(canvas, mapSchema, wallImg) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.mapSchema = mapSchema
    this.borders = [
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
    ]

    this.wallImg = wallImg
    this.animationProvider = new GameAnimation(this.canvas)

    this.initStaticCanvas()
  }

  initStaticCanvas() {
    this.staticCanvas = document.createElement("canvas")
    this.staticCanvas.id = "staticCanvas"
    this.staticCanvas.width = this.canvas.width
    this.staticCanvas.height = this.canvas.height

    this.staticCtx = this.staticCanvas.getContext("2d")
    this.canvas.insertAdjacentElement("afterend", this.staticCanvas)
  }

  drawMap(mapSchema) {
    this.staticCtx.clearRect(0, 0, this.staticCanvas.width, this.staticCanvas.height)

    this.walls = [...this.borders, ...mapSchema.walls]

    this.staticCanvas.style = `background: url('${mapSchema.bgImage}');`

    const wallImage = new Image()
    wallImage.src = mapSchema.wallImage
    wallImage.onload = () => {
      this.walls.forEach((wall) =>
        this.drawWall.call(this, wall, wallImage)
      )
    }
  }

  drawWall(wall, wallImg) {
    if (wall.type === "horizontal") {
      for (let i = wall.startX; i < wall.endX; i += 35) {
        this.staticCtx.drawImage(wallImg, i, wall.startY, 35, 35)
      }
    } else if (wall.type === "vertical") {
      for (let i = wall.startY; i < wall.endY; i += 35) {
        this.staticCtx.drawImage(wallImg, wall.startX, i, 35, 35)
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
