
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch,useSelector } from "react-redux";
// import MessageContainer.....
import MessageContainer from "./messageContainer";
import { GetContactMessages } from '../Store/ContactSlice';
import { useSocket } from '../SocketContext';

export const MainChat=({reff,ChatPerson,isAnnon})=>{
    const dispatch=useDispatch();

    const AnnonMessages=useSelector((store)=>store.AnnonMess.messages); 
    const ContactMessages=useSelector((store)=>store.Contact.Messages);
    const Auth=useSelector((store)=>store.User.Auth);

    
   

    const id=useSelector((store)=>store.User.id);
    const isLoggedIn=Auth==id;
    const {socket}=useSocket();

    // choosing the Messages for the messagePart....
    const Messages= !isAnnon ? ContactMessages : AnnonMessages ;
    console.log(AnnonMessages);
    console.log("isAnnon",isAnnon);
    
    // contactAuth..
    const contactAuth=useSelector((store)=>store.Contact.Auth)
    useEffect(()=>{
        dispatch(GetContactMessages());
   
        socket.emit("chat",{Auth});
        // preProcess the Messages......
    },[dispatch,contactAuth])
    
    return(
        <section ref={reff} className="w-full h-full   pb-[93px] overflow-y-scroll ">
            <div className="w-full sm:flex flex justify-center px-2 mt-2 ">
                <h1 className="sm:text-gray-400 text-gray-300 h-full   justify-center mb-2 sticky top-[100px] max-h-8 p-1 px-3 rounded-xl bg-gray-800/60 flex items-center text-sm font-semibold">{`Connected to ${ChatPerson}`}</h1>
            </div>

            {
                Messages.map((el,key)=>{
                       return(
                        <MessageContainer key={key} isYou={el.isYou} Mess={el.mess} Main={el} />
                       );
                })
            }

        </section>
    )
}


export default MainChat;