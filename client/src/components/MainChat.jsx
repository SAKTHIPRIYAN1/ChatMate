
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch,useSelector } from "react-redux";


// import MessageContainer.....
import MessageContainer from "./messageContainer";



const MainChat=({reff,ChatPerson})=>{
    const Messages=useSelector((store)=>store.AnnonMess.messages); 
    console.log(Messages);
    
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