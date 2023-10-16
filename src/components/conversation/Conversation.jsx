import { useEffect, useState } from "react"
import "./conversation.css"
import { axios, removeUnicode } from 'utilities'
import DeleteIcon from '@material-ui/icons/Delete';
import { useSocket } from "context/SocketContext";
import Avatar from "components/avatar/Avatar";
import { apiUrl } from "utilities/constants";

export default function Conversation({ search, conversation, currentUser, currentChatId, handleDeleteConversation }) {
  const [user, setUser] = useState(null)
  const socket = useSocket()
  useEffect(() => {
    socket?.on("getUsers", async (users) => {
      const usersId = users?.map(user => user.userId)
      if (usersId?.includes(user?._id)) {
        setUser(prev => ({
          ...prev,
          online: true
        }))
      }
    })
  }, [socket,user?._id])
  useEffect(() => {
    if (!currentUser?._id) return
    const friendId = conversation?.members?.find(m => m !== currentUser?._id)

    const getUser = async () => {
      const res = await axios.get(`${apiUrl}/users?userId=${friendId}`)
      setUser(res)
    }
    getUser()
  }, [conversation?.members, currentUser?._id])
  if (!removeUnicode(user?.username)?.includes(search)) {
    return null
  }
  return (
    <div className={`conversation ${currentChatId === conversation?._id ? "selected" : ''} `}>
      <Avatar user={user} />
      <span className="conversationName">{user?.username}</span>
      <DeleteIcon onClick={() => handleDeleteConversation(conversation?._id)} />
    </div>
  )
}
