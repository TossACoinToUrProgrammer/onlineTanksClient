import { makeAutoObservable } from "mobx"

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
  }
}

export default new GameState()
