import { useContext, useEffect, useRef, useState } from "react"
import Conversation from "components/conversation/Conversation"
import Message from "components/message/Messsage"
import "./messenger.css"
import { AuthContext } from "context/AuthContext"
import { axios } from "utilities"
import { Logout } from "context/AuthActions"
import { useHistory } from "react-router";
import { ExitToApp, Close, Menu } from '@material-ui/icons';
import StartConversation from "components/startConversation/StartConversation"
import { useSocket } from "context/SocketContext"
import { apiUrl } from "utilities/constants"


export default function Messenger() {
  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isAddNew, setIsAddNew] = useState(false)
  const socket = useSocket()
  const { user, dispatch } = useContext(AuthContext)
  const scrollRef = useRef()
  const history = useHistory();
  useEffect(() => {
    socket?.on("getMessage", data => {
      setMessages(prev => [...prev, data])
    })
  }, [socket])
  useEffect(() => {
    socket.emit("addUser", user._id)
  }, [socket, user])

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`${apiUrl}/conversation/` + user._id)
        setConversations(res)
      } catch (err) {
        console.log(err)
      }
    }
    getConversations()
  }, [user._id])
  useEffect(() => {
    if (!currentChat?._id) return
    const getMessages = async () => {
      try {
        const res = await axios.get(`${apiUrl}/message/` + currentChat?._id)
        setMessages(res)
      } catch (err) {
        console.log(err)
      }
    }
    getMessages()
  }, [currentChat?._id])
  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = {
      conversationId: currentChat?._id,
      sender: user._id,
      text: newMessage
    }
    const receiverId = currentChat.members.find(member => member !== user._id)

    try {
      const res = await axios.post(`${apiUrl}/message`, message)
      socket.emit("sendMessage", { ...res, receiverId })
      setMessages(prev => [...prev, res])
      setNewMessage("")
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);
  const inputRef = useRef()
  const handleDeleteConversation = async (id) => {
    try {
      await axios.delete(`${apiUrl}/conversation/${id}`)
      setConversations(prev => prev.filter(c => c._id !== id))
      setMessages([])
    } catch (error) {
      console.log(error)
    }
  }
  const [search, setSearch] = useState('')
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <>
      <div className="messenger">
        <div className={`chatMenu ${openMenu ? 'active' : ''}`}>
          <div className="chatMenuWrapper">
            <div className="chatHeader">
              <div className="chatHeaderOwn">
                <img className="conversationImg"
                  src={`https://ui-avatars.com/api/?background=random&name=${user?.username}`}
                  alt="avt"
                />
                <span>{user?.username}</span>
              </div>
              <div className="chatBtn">
                <Close onClick={() => setOpenMenu(false)} />
                <div className="chatLogOut" onClick={() => {
                  dispatch(Logout())
                  history.push('/login')
                }}>
                  <ExitToApp />
                </div>
              </div>
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="🔍 Search for friends" className="chatMenuInput" />
            <StartConversation search={search} inputRef={inputRef} setConversations={setConversations} isAddNew={isAddNew} setIsAddNew={setIsAddNew} setCurrentChat={setCurrentChat} />
            {conversations.map(c => (
              <div key={c._id} onClick={() => {
                setSearch('')
                setCurrentChat(c)
                setOpenMenu(false)
                inputRef.current?.focus()
              }}>
                <Conversation search={search} handleDeleteConversation={handleDeleteConversation} currentChatId={currentChat?._id} conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          {!openMenu &&
            <div className="chatBack" onClick={() => setOpenMenu(true)}>
              <Menu />
            </div>
          }
          <div className="chatBoxWrapper">
            {currentChat ? <>
              <div className="chatBoxTop">
                {messages.map(m => (
                  <div key={m._id}>
                    <Message message={m} own={m?.sender?._id === user?._id} />
                  </div>
                ))}
                <div className="scrollRef" ref={scrollRef}></div>
              </div>
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput" placeholder="write something..."
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === "NumpadEnter") {
                      handleSubmit(e)
                    }
                  }}
                  value={newMessage}
                  ref={inputRef}
                >
                </textarea>
                <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
              </div>
            </> : <span className="noConversationText">
              Open a conversation to start a chat
            </span>}
          </div>
        </div>
      </div>
    </>
  )
}
