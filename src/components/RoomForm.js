import React, { useRef } from "react"
import "../styles/roomForm.scss"

const RoomForm = ({ addRoom }) => {
  const inputRef = useRef()

  const submitHandler = (e) => {
    e.preventDefault()
    addRoom(Date.now(), inputRef.current.value)
    inputRef.current.value = ""
  }

  return (
    <>
      <h3 className="title">Create Room:</h3>
      <form className="form" onSubmit={submitHandler}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter room name..."
          className="form__input form__input-name"
        />
        <button type="submit" className="form__input form__input-btn">
          Create
        </button>
      </form>
    </>
  )
}

export default RoomForm
