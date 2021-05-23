import React, { useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"

import GameController from "../gameCore/GameController"
import "../styles/canvas.scss"
import gameState from "../state/gameState"
import socketState from "../state/socketState"

const Canvas = observer(() => {
  const canvasRef = useRef()

  useEffect(() => {
    const id = Date.now()
    gameState.setId(id)

    const gameController = new GameController(canvasRef.current)
    gameState.setController(gameController)
    gameController.start()
    if(gameState.mapSchema) gameController.drawMap(gameState.mapSchema)

    socketState.socket.send(
      JSON.stringify({
        method: "enter-room",
        roomId: socketState.roomId,
        id: gameState.id,
      })
    )
  }, [])

  const exitHandler = () => {
    gameState.controller.exitRoom()
    socketState.exitRoom()
  }

  return (
    <>
      <button onClick={exitHandler}>Exit</button>
      <h3>Room Id: {socketState.roomId}</h3>
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} id="canvas" width="525" height="525"></canvas>
      </div>
      {gameState.players.map((player) => {
        return (
          <p key={player.id}>
            <span color="red">{player.id}: </span> {player.score}{" "}
          </p>
        )
      })}
    </>
  )
})

export default Canvas
