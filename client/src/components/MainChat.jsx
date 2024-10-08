
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch,useSelector } from "react-redux";


// import MessageContainer.....
import MessageContainer from "./messageContainer";

// chattimer..
import ChatTimer from "./ChatTimer";

const MainChat=({ChatPerson})=>{
    const Messages=useSelector((store)=>store.AnnonMess.messages);
    
    console.log(Messages);
    return(
        <section className="w-full h-full   pb-[105px] overflow-y-scroll ">
            <div className="w-full sm:flex flex justify-center sm:justify-between px-2 mt-2 ">
                <h1 className="sm:text-gray-400 text-gray-300 h-full sm:justify-start sm:bg-transparent justify-center mb-2 sticky top-[100px] max-h-8 p-1 px-3 rounded-xl bg-gray-800 flex items-center font-semibold">{`Connected to ${ChatPerson}`}</h1>
                <div className="hidden sm:inline-block">
                    <ChatTimer /> 
                </div>
            </div>

            {
                Messages.map((el,key)=>{
                       return(
                        <MessageContainer key={key} isYou={el.isYou} Mess={el.mess} />
                       );
                })
            }

        </section>
    )
}


export default MainChat;