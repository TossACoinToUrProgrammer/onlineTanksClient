import { makeAutoObservable } from "mobx"
import socketState from "./socketState"

class GameState {
  id = null
  controller = null
  players = []
  mapSchema = null

  constructor() {
    makeAutoObservable(this)
  }

  setId(id) {
    this.id = id
  }

  setController(controller) {
    this.controller = controller
  }

  setPlayers(players) { 
    this.players = players
  }

  setMapSchema(schema) {
    this.mapSchema = schema
  }

  setScores(playerId, scoreChange) {
    this.players.find((player) => player.id === playerId).score += scoreChange
    if(this.id === playerId && this.controller.gameCanvas.tanksCounter() <= 1) {
      socketState.restart()
    }
  }
}

export default new GameState()
