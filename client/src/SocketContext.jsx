import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();


const apiUrl = import.meta.env.VITE_BACKURL;
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    useEffect(() => {
        // Connect to the socket only if it hasn't been initialized yet
        if (!socket) {
            console.log("try to connn")
            const newSocket = io(apiUrl, { transports: ['websocket', 'polling'] });
            setSocket(newSocket);
            
            // // Handle disconnecting when the provider unmounts
            return () => {
                newSocket.disconnect();
            };
        }
    }, []);


    return (
        <SocketContext.Provider value={{ socket, setIsAuthenticated }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
