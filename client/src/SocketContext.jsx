import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { clearMess,clearContact } from './Store/ContactSlice';
const SocketContext = createContext();


// import form store,,,,
import { useSelector,useDispatch } from 'react-redux';
import { addNewAnnonMess } from './Store/AnnonymousMessages';
import { clearAnnonMess } from './Store/AnnonymousMessages';
import { ClearAnnonRecip } from './Store/AnonymousUser';
import store from './Store/store';
import axios from 'axios';
import { setUser,setUserAuth } from './Store/AuthUser';

import toast from 'react-hot-toast';
import { setMessages } from './Store/ContactSlice';

const apiUrl = import.meta.env.VITE_BACKURL;
export const SocketProvider = ({ children }) => {
    const dispatch=useDispatch();
    const [socket, setSocket] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    // Auth...
    const {Auth}=useSelector((store)=>store.User);


    useEffect(() => {
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


            // for deleting the Messages and blocking the contact...
            newSocket.on('Blocked',({contact})=>{
                console.log(contact);
                dispatch(clearContact());
            })

            
            newSocket.on('Deleted',({contact})=>{
                    console.log("Del Socket");
                    console.log(contact);
                    // dispatch(clearAnnonMess());
                    dispatch(clearMess());
            })
                

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

                toast.custom((t) => (
                    <div className="flex  items-center  py-[0.3rem] px-2 sm:text-[15px] md:text-[18px]  backdrop-blur-lg  bg-slate-800/80 rounded-md">
                            <span className="flex items-center p-2 ">        
                                Save Request from <b className=' ml-[4px] font-bold text-teal-400 '>{" "+sender}</b>
                            </span>
                            <div className="flex h-full border-l-2  border-l-slate-400/50 items-center  p-2 ">
                            <button className='font-extrabold' onClick={() => toast.dismiss(t.id)}>
                                    Close
                            </button>
                            </div>
                    </div>
                  ), {
                    position: "bottom-left", // Move toast to the bottom-left corner
                    duration: 1000,
                  });
            })

            // for receiving file in chattt....
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


            // for receiving it in the Chat..
            newSocket.on('receiveFileChat', ({ filePath, name }) => {
                console.log("file received...",filePath,name)
                dispatch(setMessages(
                    {
                        isYou:false,
                        mess:'file1',
                        isFile:true,
                        path:filePath,
                        filename:name
                    }
                ))
        });





            // for getting chat MEssages...

            newSocket.on("ChatMessage",({sender,receiver,chatId,message})=>{
                console.log(sender,receiver,chatId,message);
                dispatch(setMessages({isYou:sender?.toLowerCase()==Auth?.toLowerCase(),mess:message,isFile:false}));

            })

              
    

            
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
