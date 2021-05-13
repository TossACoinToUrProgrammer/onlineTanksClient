import { makeAutoObservable } from "mobx"

class GameState {
  id = null
  gameController = null
  players = []

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

  setScores(playerId, scoreChange) {
    this.players.find((player) => player.id === playerId).score += scoreChange
  }
}

export default new GameState()
