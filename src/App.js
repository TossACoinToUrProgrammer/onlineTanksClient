import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"

import socketState from "./state/socketState"

import "./styles/app.scss"

import Canvas from "./components/Canvas"
import HostMenu from "./components/HostMenu"
import gameState from "./state/gameState"

const App = observer(() => {
  const [connection, setConnection] = useState(false)

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000/")
    socketState.setSocket(socket)

    socket.onopen = () => {
      setConnection(true)
    }

    socketState.socket.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      switch (msg.method) {
        case "create-room":
          gameState.setMapSchema(msg.schema)
          socketState.setRoom(msg.id)
          break
        case "rooms":
          socketState.setRooms(msg.rooms)
          break
        case "enter-room":
          gameState.setMapSchema(msg.schema)
          gameState.controller.drawMap(msg.schema)
          gameState.controller.addPlayers(msg.players)
          break
        case "event":
          gameState.controller.eventHandler(msg)
          break
        case "update-score":
          gameState.setScores(msg.playerId, msg.scoreChange)
          break
      }
    }

    // document.addEventListener("visibilitychange", function() {
    //   if(document.visibilityState === 'hidden' && socketState.roomId) {
    //     socketState.exitRoom()
    //   }
    // })
  }, [])

  return (
    <>
      <header>
        <div className="container">
          <h1>Tanks Online</h1>
        </div>
      </header>
      <div className="App container">
        {!connection ? (
          "Connecting..."
        ) : (
          <>{socketState.roomId ? <Canvas /> : <HostMenu />}</>
        )}
      </div>
      <footer></footer>
    </>
  )
})

export default App
