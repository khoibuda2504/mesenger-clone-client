import "./avatar.css";
import React from 'react'
export default function Avatar({ user }) {
  return (
    <div className='avatar'>
      <img className="conversationImg"

        src={`https://ui-avatars.com/api/?background=random&name=${user?.username}`}
        alt="avt"
      />
      {user?.online &&
        <div className="chatOnlineBadge"></div>
      }
    </div>
  )
}