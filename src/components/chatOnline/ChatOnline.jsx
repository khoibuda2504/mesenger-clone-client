import {axios} from 'utilities'
import { useEffect, useRef, useState } from "react";
import "./chatOnline.css";
import { useSocket } from 'context/SocketContext';
import { apiUrl } from 'utilities/constants';

export default function ChatOnline({ currentId, setCurrentChat }) {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const socket = useSocket()
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    socket?.on("getUsers", async (users) => {
      const res = await Promise.all(users.map(u => {
        return axios.get(`${apiUrl}/users?userId=${u.userId}`);
      }))
      setOnlineFriends(res.map(d => d.data));
    })
  }, [])
  const handleClick = async user => {
    try {
      const res = await axios.get(
        `${apiUrl}/conversation/find/${currentId}/${user._id}`
      );
      if(!!res.data.length) {
        setCurrentChat(res.data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div key={o.email} className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? PF + o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}