import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SocketContextProvider } from './context/SocketContext'
import { AuthContextProvider } from "./context/AuthContext";

ReactDOM.render(
  <AuthContextProvider>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </AuthContextProvider>,
  document.getElementById("root")
);
