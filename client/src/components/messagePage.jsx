
import ClipIc from "./svg";
import { Similey } from "./svg";
import ConcatDescrip from "./contactDescrip";
import { SendIc } from "./svg";
import ChatTimer from "./ChatTimer";
import { useNavigate } from "react-router-dom";

import { useRef } from "react";
import { useState,useEffect } from "react";

//  chat Person slice from store...
import { useSelector } from "react-redux";
import { ArrowLeftIcon } from "./svg";


const MessagePart=()=>{
    const val=useSelector((store)=>store.AnnRecip.hasRecip);
    // const navigate=useNavigate();
    // useEffect(()=>{
    //     if(!val){
    //         navigate("/login");
    //     }
    // },[])


    return(
        <div className="h-[100vh] w-[100vw]  gap-0 border-none  bg  p-0 flex">
            <ConcatDescrip />
            <MessContain />
        </div>
    )
}

const MessContain=()=>{
    return(
        <div className="h-full w-[70%] sm:w-[100%] relative ">
        <MessHead/>
        <MainChat />
        <TyperDiv />
        </div>
    )
}

const MainChat=()=>{
    return(
        <section className="w-full ">
            <div className="w-full flex bg-black  px-2 mt-2 ">
                <ChatTimer /> 
            </div>
        </section>
    )
}

const MessHead=()=>{
    // const ChatPerson=useSelector((store)=>store.AnnRecip.name);
    const navigate=useNavigate();
    const ChatPerson="SAKTHI"
    return(
        <div className=" flex transparent_tone justify-between flex-row w-full px-3 h-[45px] ">
            <div className="h-full hidden sm:flex sm:mr-3 hover:cursor-pointer active:scale-90 transition-all items-center" onClick={()=>{navigate("/register")}}>
                <ArrowLeftIcon />
            </div>
           <div className="h-[100%] w-[122px] flex-1 justify-start flex items-center  "> 
                <h1 className="text-teal-200 font-semibold text-lg cursor-pointer truncate">
                    {ChatPerson}
                </h1>
           </div>
           <div className="h-full  flex items-center min-w-[100px] gap-3 justify-between">
                <button className="button px-5 w-auto bg-teal-700 rounded-full">
                    save
                </button>

                <button className="button px-5 w-auto rounded-full bg-slate-500/20">
                    next
                </button>
           </div>
        </div>
    )
}

const TyperDiv = () => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    const handleInput = (e) => {
        setMessage(e.target.value);
        textareaRef.current.style.height = 'auto'; // Reset height
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
        if (textareaRef.current.scrollHeight > 150){ //limit height....
            textareaRef.current.style.height = '150px'; // Set max height
            textareaRef.current.style.overflowY = 'scroll'; // Enable  scrolling
        } else {
            textareaRef.current.style.overflowY = 'hidden'; // Hide scroll if content is small
        }
    };

    const pt = textareaRef.current && textareaRef.current.scrollHeight > 45 ? 'mt-3' : ''; // Apply pt-2 if height > 100px


    return (
        <div className="flex transparent_tone w-[100%] px-4 bottom-[1px] right-0 left-0 absolute h-auto min-h-[45px] ">
            <div className="min-h-[45px] h-auto flex items-end mr-4">
                <ClipIc />
            </div>

            <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                placeholder="Enter your message..."
                name="message"
                id="mess"
                className={`resize-none  my-auto bg-transparent w-[100%] flex-1 outline-none  overflow-hidden ${pt}` }
                rows={1}
                style={{ maxHeight: '150px' }}
            />

            <div className="min-h-[45px] h-auto flex items-end  mr-2 gap-4 ml-4">
                <Similey />
                <SendIc />
            </div>
        </div>
    );
};

export default MessagePart;


