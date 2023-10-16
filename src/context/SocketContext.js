import React, { useContext } from 'react'
import { createContext } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const socket = io("ws://localhost:8900")
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
export const useSocket = () => useContext(SocketContext);