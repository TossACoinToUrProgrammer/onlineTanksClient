import GameCanvas from "../gameCore/GameCanvas.js"
import Tank from "../gameCore/Tank"
import tank_img_src from "../assets/images/tank.png"
import tank2_img_src from "../assets/images/tealTank.png"
import gameState from "../state/gameState.js"

export default class GameController {
  constructor(canvas) {
    this.canvas = canvas
    this.gameCanvas = undefined
  }

  start() {
    this.tankImgs = [tank_img_src, tank2_img_src]

    this.tankImgs = this.tankImgs.map((url) => {
      const img = new Image()
      img.src = url
      return img
    })

    this.tankImgs.forEach((img) => {
      img.onload = () => this.gameCanvas.draw()
    })

    this.gameCanvas = new GameCanvas(this.canvas)
  }

  restart() {
      this.drawMap(gameState.mapSchema)
      this.addPlayers(gameState.players.map(player => player.id))
  }

  drawMap(mapSchema) {
    this.gameCanvas.drawMap(mapSchema)
  }

  addPlayers(players) {
    this.gameCanvas.destroyAllObjects()

    players.forEach((id, index) => {
      const tank = new Tank(
        this.gameCanvas,
        {
          xPos: gameState.mapSchema[`playerPos_${index}`].x,
          yPos: gameState.mapSchema[`playerPos_${index}`].y,
          id,
        },
        this.tankImgs[index]
      )

      this.gameCanvas.addObject(tank)
      this.gameCanvas.draw()
    })

    gameState.setPlayers(
      players.map((id) => {
        return { id, score: gameState.players.find(el => el.id === id)?.score || 0 }
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
