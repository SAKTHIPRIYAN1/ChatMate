import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();


// import form store,,,,
import { useSelector,useDispatch } from 'react-redux';
import { addNewAnnonMess } from './Store/AnnonymousMessages';
import { clearAnnonMess } from './Store/AnnonymousMessages';
import { ClearAnnonRecip } from './Store/AnonymousUser';
import store from './Store/store';

import toast from 'react-hot-toast';

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


            // for receiving normal message....
            newSocket.on("ReceiveMessage",(message)=>{
                console.log("received Message:",message);
                dispatch(addNewAnnonMess({isYou:false,mess:message,isFile:false}));
            });

            
            newSocket.on("senderDisconnected", () => {
                console.log("Receiver Disconnected....");
                dispatch(clearAnnonMess());
                dispatch(ClearAnnonRecip())
                // navigate("/register");
            });

            // // for save request.....
            newSocket.on("saveReq",({sender,sendAuth})=>{
                console.log("Save request came from",sender);

                toast((t) => (
                    <span className="flex items-center gap-2 bg-sender">
                      Save Request from <b className='font-bold text-teal-400 '>{sender}</b>
                      <button
                        className="ml-2 px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
                        onClick={() => toast.dismiss(t.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="ml-2 px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
                        onClick={() => toast.dismiss(t.id)}
                      >
                       Decline
                      </button>
                    </span>
                  ), {
                    position: "top-right", // Move toast to the top-right corner
                    duration: 3000, // Toast will disappear after 4 seconds
                  });
            })

            // for receiving file....
            newSocket.on('receiveFile', ({ filePath, name }) => {
                    console.log("file received...",filePath,name)
                    dispatch(addNewAnnonMess(
                        {
                            isYou:false,
                            mess:'file1',
                            isFile:true,
                            path:filePath,
                            filename:name
                        }
                    ))
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
