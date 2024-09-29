
import ClipIc from "./svg";
import { Similey } from "./svg";
import ConcatDescrip from "./contactDescrip";
import { SendIc } from "./svg";
import ChatTimer from "./ChatTimer";

import { useRef } from "react";
import { useState } from "react";

const MessagePart=()=>{
    return(
        <div className="h-[100vh] w-[100vw]  gap-0 border-none  bg  p-0 flex">
            <ConcatDescrip />
            <MessContain />
        </div>
    )
}

const MessContain=()=>{
    return(
        <div className="h-full w-[70%] relative ">
        <MessHead/>
        <MainChat />
        <TyperDiv />
        </div>
    )
}

const MainChat=()=>{
    return(
        <h1>
            {/* messages willbe displayed here..... */}
        </h1>
    )
}

const MessHead=()=>{
    const [ChatPerson,setPerson]= useState("HP");
    return(
        <div className=" flex transparent_tone justify-between flex-row w-full px-4 h-[45px] ">
           <div className="h-[100%] flex items-center mr-4"> 
                <h1 className="text-teal-200 font-semibold cursor-pointer">
                    {ChatPerson}
                </h1>
           </div>
        
        {/* <ChatTimer />  */}
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


