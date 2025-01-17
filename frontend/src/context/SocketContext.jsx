import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();


export const useSocketContext = () => {
  return useContext(SocketContext);
}


export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000", {
        query: { userId: authUser._id },
        withCredentials: true,
      });
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.off("getOnlineUsers"); // Clean up listeners
        socket.close(); // Close the socket connection when authUser changes or component unmounts
      };
    } else {
      if (socket) {
        socket.close(); // Close the socket when the user logs out
        setSocket(null);
      }
    }
  }, [authUser]); // Re-run the effect whenever authUser changes

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
