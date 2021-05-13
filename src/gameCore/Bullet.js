import gameState from "../state/gameState"
import socketState from "../state/socketState"
import GameObject from "./GameObject"

export default class Bullet extends GameObject {
  constructor(gameCanvas, params) {
    super(gameCanvas, params)

    this.type = "bullet"
    this.tankId = params.tankId
    this.lifetime = params.lifetime
    this.lifetimeTimeoutID = undefined
    this.ctx = this.gameCanvas.canvas.getContext("2d")
    this.size = 3 //радиус пули в пикселях
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.xPos, this.yPos, this.size, 0, 2 * Math.PI, false)
    this.ctx.fill()
  }

  destroy() {
    super.destroy()

    clearTimeout(this.lifetimeTimeoutID)

    this.gameCanvas.animationProvider.drawAnimation(
      "https://i.gifer.com/4xjg.gif",
      this.xPos - this.size / 2,
      this.yPos - this.size / 2,
      this.size * 4,
      this.size * 4,
      1000,
      this.id
    )
  }

  startMoving() {
    super.startMoving()
    this.lifetimeTimeoutID = setTimeout(() => this.destroy(), this.lifetime)
  }

  move() {
    super.move()
    this.hitObjects()
  }

  hitObjects() {
    for (let i in this.gameCanvas.objects) {
      const obj = this.gameCanvas.objects[i]
      if (this.hitObjectsCheck(obj)) {
        if (obj.type === "tank" && this.tankId === gameState.id) {
          socketState.socket.send(
            JSON.stringify({
              method: "kill",
              id: this.tankId,
              score: obj.id === this.tankId ? -1 : 1,
              roomId: socketState.roomId,
            })
          )
        }
        this.destroy()
        obj.destroy()
        return
      }
    }
  }

  hitObjectsCheck(obj) {
    return (
      this.id !== obj.id &&
      this.yPos + this.size >= obj.yPos &&
      this.yPos <= obj.yPos + obj.size &&
      this.xPos + this.size >= obj.xPos &&
      this.xPos <= obj.xPos + obj.size
    )
  }

  hitWalls() {
    for (let i = 0; i < this.gameCanvas.walls.length; i++) {
      const wall = this.gameCanvas.walls[i]
      if (this.hitWallsCheck(this.size, wall)) {
        //проверка находится ли пуля внутри стены
        this.hitWall(wall)
        return true
      }
    }
    return false
  }

  hitWall(wall) {
    if (wall.type === "horizontal") {
      //если пуля прилетела сбоку стены
      this.prevY >= wall.startY && this.prevY + this.size <= wall.endY
        ? this.hitVerticalWall()
        : this.hitHorizontalWall()
    }
    if (wall.type === "vertical") {
      //если пуля прилетела сверху или снизу стены
      this.prevX + this.size >= wall.startX && this.prevX <= wall.endX
        ? this.hitHorizontalWall()
        : this.hitVerticalWall()
    }
  }

  hitVerticalWall() {
    this.angle = 360 - this.angle
  }

  hitHorizontalWall() {
    if (this.angle < 90) this.angle = 180 - this.angle
    else if (this.angle <= 180) this.angle = 90 - (this.angle - 90)
    else if (this.angle < 270) this.angle = 360 - (this.angle - 180)
    else if (this.angle < 360) this.angle = 360 - this.angle + 180
  }
}
