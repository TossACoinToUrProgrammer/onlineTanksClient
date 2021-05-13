import React, { useEffect, useState } from "react"
import RoomForm from "./RoomForm"
import RoomList from "./RoomList"
import "../styles/hostMenu.scss"
import socketState from "../state/socketState"
import { observer } from "mobx-react-lite"

const HostMenu = observer(() => {
  useEffect(() => {
    socketState.socket.send(JSON.stringify({ method: "rooms" }))
  }, [])

  return (
    <div className="container">
      <div className="host-menu">
        <RoomForm addRoom={socketState.addRoom} />
        <RoomList rooms={socketState.rooms} />
      </div>
    </div>
  )
})

export default HostMenu
