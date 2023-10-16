import './message.css'
import { format } from 'timeago.js'
export default function Message({ own, message }) {
  return (
    <div className={`message ${own ? 'own' : ''}`}>
      <div className="messageTop">
        <img
          src={`https://ui-avatars.com/api/?background=random&name=${message?.sender?.username}`}
          alt=""
          className='messageImg' />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">
        {format(message.createdAt)}
      </div>
    </div>
  )
}
