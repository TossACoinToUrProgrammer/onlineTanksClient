import React from 'react';
import socketState from '../state/socketState.js';
import Room from './Room.js'

const RoomList = ({rooms = []}) => {

    const enterRoom = (id) => {
        socketState.setRoom(id)
    }

    return (
        <div>
           <h3>Open Rooms:</h3>
           <ul className='list'>
            {rooms.map(room => <Room key={room.id} room={room} enterRoom={() => enterRoom(room.id)} />)}
           </ul>
        </div>
    );
};

export default RoomList;