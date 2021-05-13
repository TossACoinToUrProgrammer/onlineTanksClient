export default class GameObject {
  constructor(gameCanvas,
    { xPos = 0, yPos = 0, angle = 0, moveStep = 5, moveInterval = 50, id })
  {
    this.gameCanvas = gameCanvas
    this.xPos = xPos
    this.yPos = yPos
    this.angle = angle
    this.moveStep = moveStep //кол-во пикселей за один шаг
    this.moveInterval = moveInterval //частота шагов в миллисекундах
    this.moveIntervalID = undefined
    this.id = id
    this.direction = "forward"
  }

  draw() {
    throw new Error("Функция не реализована")
  }

  move() {
    //В функции в зависимости от угла поворота обьекта на канвасе будем прибавлять его позиции соответствующие значения
    //Например: чем угол ближе к оси x, тем больше будет шаг в оси x и меньше в оси у

    //нижнее значение четверти
    let quarterBottom
    //переменные показывают знак оси в определенной четверти (положительное, отрицательное), в движении назад значение будут реверсивными
    let xAxis, yAxis
    xAxis = yAxis = this.direction === "backward" ? -1 : 1

    //в соответствии с четвертью присваиваем переменным значения
    if (this.angle <= 90) {
      quarterBottom = 0
    } else if (this.angle <= 180) {
      quarterBottom = 90
      yAxis *= -1
    } else if (this.angle <= 270) {
      quarterBottom = 180
      xAxis *= -1
      yAxis *= -1
    } else if (this.angle <= 360) {
      quarterBottom = 270
      xAxis *= -1
    }

    //с помощью полученных данных расчитываем длину шага в оси x и y, и прибавлем их в переменные xPos yPos
    let yStep, xStep
    xStep = yStep = (this.angle - quarterBottom) / (90 / this.moveStep)
    if (quarterBottom === 90 || quarterBottom === 270)
      xStep = this.moveStep - xStep
    if (quarterBottom === 0 || quarterBottom === 180)
      yStep = this.moveStep - yStep

    this.prevX = this.xPos
    this.prevY = this.yPos

    this.xPos += xStep * xAxis
    this.yPos -= yStep * yAxis

    this.hitWalls()
    this.gameCanvas.draw()
  }

  stopMoving() {
    clearInterval(this.moveIntervalID)
    this.moveIntervalID = undefined
  }

  startMoving(direction) {
    this.moveIntervalID = setInterval(
      () => this.move(direction),
      this.moveInterval
    )
  }

  hitWalls() {} //реализовано в наследованных классах

  hitWallsCheck(size, wall) {
    return (
      this.yPos + size >= wall.startY &&
      this.yPos <= wall.endY &&
      this.xPos + size >= wall.startX &&
      this.xPos <= wall.endX
    )
  }

  destroy() {
    this.stopMoving()
    this.gameCanvas.destroyObject(this.id)
  }
}
