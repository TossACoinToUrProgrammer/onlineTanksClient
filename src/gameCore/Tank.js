import gameState from "../state/gameState.js"
import socketState from "../state/socketState.js"
import Bullet from "./Bullet.js"
import GameObject from "./GameObject.js"

export default class Tank extends GameObject {
  constructor(gameCanvas, params, tankImg) {
    super(gameCanvas, params)
    this.ctx = this.gameCanvas.canvas.getContext("2d")
    this.type = "tank"
    this.size = 30
    this.tankImg = tankImg
    this.turnAsideIntervalID = undefined
    this.shootRate = 300
    this.shootOnCD = false

    this.keyDownHandler = this.keyDownHandler.bind(this)
    this.keyUpHandler = this.keyUpHandler.bind(this)
    this.keyPressHandler = this.keyPressHandler.bind(this)

    if(gameState.id === this.id) {
      this.listen()
    }
  }

  listen() {
    document.addEventListener("keydown", this.keyDownHandler)
    document.addEventListener("keyup", this.keyUpHandler)
    document.addEventListener("keypress", this.keyPressHandler)
  }

  eventHandler(e) {
    switch (e.type) {
      case "keydown":
        switch (e.code) {
          case "KeyD":
            if (!this.turnAsideIntervalID) this.turnAside("right")
            break
          case "KeyA":
            if (!this.turnAsideIntervalID) this.turnAside("left")
            break
          case "KeyW":
            this.direction = "forward"
            if (!this.moveIntervalID) this.startMoving(this.direction)
            break
          case "KeyS":
            this.direction = "backward"
            if (!this.moveIntervalID) this.startMoving(this.direction)
            break
          default:
            break
        }
        break
      case "keyup":
        if (e.code === "KeyW" || e.code === "KeyS") {
          this.stopMoving()
        }
        if (e.code === "KeyA" || e.code === "KeyD") {
          this.stopTurnAside()
        }
        break
      case "keypress":
        switch (e.code) {
          case "Enter":
            this.shoot()
            break
        }
        break
    }
  }

  destroy() {
    super.destroy()

    document.removeEventListener("keydown", this.keyDownHandler)
    document.removeEventListener("keyup", this.keyUpHandler)
    document.removeEventListener("keypress", this.keyPressHandler)

    this.stopTurnAside()

    this.gameCanvas.animationProvider.drawAnimation(
      "https://bestanimations.com/media/explosions/1761246774explosion-animation-5.gif",
      this.xPos - this.size / 2,
      this.yPos - this.size / 2,
      this.size * 2,
      this.size * 2,
      1300,
      this.id
    )
  }

  draw() {
    //поворачиваем под нужным углом оси канваса, вставляем изображение и возвращаем оси в изначальное положение
    this.ctx.translate(this.xPos + this.size / 2, this.yPos + this.size / 2)
    this.ctx.rotate(this.angle * (Math.PI / 180))
    this.ctx.translate(
      -(this.xPos + this.size / 2),
      -(this.yPos + this.size / 2)
    )
    this.ctx.drawImage(this.tankImg, this.xPos, this.yPos, this.size, this.size)
    this.ctx.rotate(-this.angle * (Math.PI / 180))
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  hitWalls() {
    this.gameCanvas.walls.some(
      (item) => this.hitWallsCheck(this.size, item) //проверка столкнулся ли танк со стеной
    ) && this.hitWall()
  }

  hitWall() {
    this.xPos = this.prevX
    this.yPos = this.prevY
  }

  turnAside(direction) {
    let step = direction === "right" ? 10 : 350
    this.turnAsideIntervalID = setInterval(() => {
      this.angle += step
      if (this.angle >= 360) this.angle %= 360
      this.gameCanvas.draw()
    }, 50)
  }

  stopTurnAside() {
    clearInterval(this.turnAsideIntervalID)
    this.turnAsideIntervalID = undefined
  }

  shoot() {
    if (this.shootOnCD) return

    this.shootOnCD = true
    setTimeout(() => (this.shootOnCD = false), this.shootRate)

    //--- высчитывается позиция в которой будет находится пуля относительно танка в момент выстрела--//
    let bulletX = 0,
      bulletY = 0,
      quarterBottom

    const calcPos = (quarterBottom) =>
      (this.angle - quarterBottom) / (90 / this.size)

    if (this.angle <= 45) {
      quarterBottom = 0
      bulletX = calcPos(quarterBottom) + this.size / 2
      bulletY = -3
    } else if (this.angle <= 135) {
      quarterBottom = 45
      bulletX = this.size + 3
      bulletY = calcPos(quarterBottom)
    } else if (this.angle <= 225) {
      quarterBottom = 135
      bulletX = this.size - calcPos(quarterBottom)
      bulletY = this.size
    } else if (this.angle <= 315) {
      quarterBottom = 225
      bulletY = this.size - calcPos(quarterBottom)
      bulletX = -3
    } else if (this.angle <= 360) {
      quarterBottom = 315
      bulletX = calcPos(quarterBottom)
      bulletY = -3
    }
    //-----//

    const bullet = new Bullet(this.gameCanvas, {
      xPos: bulletX + this.xPos,
      yPos: bulletY + this.yPos,
      angle: this.angle,
      lifetime: 7000,
      id: Date.now(),
      moveStep: 6,
      moveInterval: 40,
      tankId: this.id
    })

    this.gameCanvas.addObject(bullet)
    this.gameCanvas.draw()

    if (bullet.hitWalls()) {
      //если пуля была выстрелена вплотную в стену, то выстреливший танк уничтожается
      this.destroy()
      bullet.destroy()
    } else {
      bullet.startMoving()
    }
  }

  keyDownHandler(e) {
    socketState.socket.send(
      JSON.stringify({
        method: "event",
        type: "keydown",
        code: e.code,
        id: this.id
      })
    )
  }

  keyUpHandler(e) {
    socketState.socket.send(
      JSON.stringify({
        method: "event",
        type: "keyup",
        code: e.code,
        id: this.id
      })
    )
  }

  keyPressHandler(e) {
    socketState.socket.send(
      JSON.stringify({
        method: "event",
        type: "keypress",
        code: e.code,
        id: this.id
      })
    )
  }
}
