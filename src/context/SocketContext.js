import React, { useContext } from 'react'
import { createContext } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const socket = io("ws://messenger-clone-socket.vercel.app/")
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
export const useSocket = () => useContext(SocketContext);