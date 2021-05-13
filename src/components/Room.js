import React from 'react';
import '../styles/room.scss'

const Room = ({room, enterRoom}) => {
    return (
        <li className='room' onClick={enterRoom} id={room.id}>
            {room.name}
        </li>
    );
};

export default Room; 