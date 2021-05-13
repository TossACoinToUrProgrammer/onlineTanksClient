import GameCanvas from "../gameCore/GameCanvas.js"
import Tank from "../gameCore/Tank"
import tank_img_src from "../assets/images/tank.png"
import wall_img_src from "../assets/images/wall.jpg"
import mapSchemas from "../gameCore/shemas.js"
import gameState from "../state/gameState.js"

export default class GameController {
  constructor(canvas) {
    this.canvas = canvas
    this.gameCanvas = undefined
    this.mapSchema = undefined
  }

  start() {
    const wallImg = new Image()
    wallImg.src = wall_img_src

    this.tankImg = new Image()
    this.tankImg.src = tank_img_src
    this.tankImg.onload = () => this.gameCanvas.draw()

    this.mapSchema = mapSchemas[Math.floor(Math.random() * mapSchemas.length)]
    this.gameCanvas = new GameCanvas(this.canvas, this.mapSchema, wallImg)

    wallImg.onload = () => this.gameCanvas.drawWalls()
  }

  addPlayers(players) {
    this.gameCanvas.destroyAllObjects()

    players.forEach((id, index) => {
      const tank = new Tank(
        this.gameCanvas,
        {
          xPos: this.mapSchema[`playerPos_${index}`].x,
          yPos: this.mapSchema[`playerPos_${index}`].y,
          id,
        },
        this.tankImg
      )

      this.gameCanvas.addObject(tank)
      this.gameCanvas.draw()
    })

    gameState.setPlayers(
      players.map((id) => {
        return { id, score: 0 }
      })
    )
  }

  eventHandler(event) {
    if (!this.gameCanvas.objects[event.id]) return
    this.gameCanvas.objects[event.id].eventHandler(event)
  }

  exitRoom() {
    this.gameCanvas.destroyAllObjects()
  }
}
