import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();


// import form store,,,,
import { useSelector,useDispatch } from 'react-redux';
import { addNewAnnonMess } from './Store/AnnonymousMessages';
import store from './Store/store';


const apiUrl = import.meta.env.VITE_BACKURL;
export const SocketProvider = ({ children }) => {
    const dispatch=useDispatch();

    const [socket, setSocket] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 


    useEffect(() => {
        // Connect to the socket only if it hasn't been initialized yet
        
        if (!socket) {
            console.log("try to connn");
            const newSocket = io(apiUrl, {
                transports: ['websocket', 'polling'],
                reconnectionAttempts: 5,    // Limit
                reconnectionDelay: 2000,    // Delay 
                reconnectionDelayMax: 5000, // Max delay for reconnection
                timeout: 10000              // Timeout for attempt
            });
            setSocket(newSocket);
            
            newSocket.on('connect_error', (error) => {
                console.log("Connection Error : websocket failed to connect check your server");
            });

            newSocket.on("ReceiveMessage",(message)=>{
                console.log("received Message:",message);
                dispatch(addNewAnnonMess({isYou:false,mess:message}));
            });
    

            // // Handle reconnection attempt failures
            // newSocket.on('reconnect_failed', () => {
            //     console.log("failed after maximum attempts");
            // });


            // // Handle disconnecting 
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
