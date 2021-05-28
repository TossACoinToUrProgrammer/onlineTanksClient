import { makeAutoObservable } from "mobx"

class SocketState {
  socket = null
  roomId = null
  rooms = []

  constructor() {
    makeAutoObservable(this)
    this.addRoom = this.addRoom.bind(this)
  }

  setSocket(socket) {
    this.socket = socket
  }

  setRoom(roomId) {
    this.roomId = roomId
  }

  exitRoom() {
    this.socket.send(
      JSON.stringify({ method: "exit-room", roomId: this.roomId })
    )
    this.roomId = null
  }

  restart() {
    this.socket.send(
      JSON.stringify({ method: "restart", roomId: this.roomId })
    )
  }

  setRooms(rooms) {
    this.rooms = rooms
  }

  addRoom(id, name) {
    this.socket.send(
      JSON.stringify({ method: "create-room", room: { id, name } })
    )
  }
}

export default new SocketState()
