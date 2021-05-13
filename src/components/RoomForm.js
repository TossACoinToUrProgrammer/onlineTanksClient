import React, { useRef } from "react"
import "../styles/roomForm.scss"

const RoomForm = ({ addRoom }) => {
  const inputRef = useRef()

  const submitHandler = () => {
      addRoom(Date.now(), inputRef.current.value)
      inputRef.current.value = ''
  }

  return (
    <>
      <h3 className="title">Create Room:</h3>
      <div className="form">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter room name..."
          className="form__input form__input-name"
        />
        <button onClick={submitHandler} className="form__input form__input-btn"> Create </button>
      </div>
    </>
  )
}

export default RoomForm
