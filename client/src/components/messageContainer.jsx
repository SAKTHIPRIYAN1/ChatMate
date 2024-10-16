import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
 const MessageContainer=({isYou,Mess})=>{
    return(
        <div>
            {
                isYou ? <YourMessContainer Mess={Mess} /> : <TheirMessContainer Mess={Mess} />
            }
        </div>
    )
 }

 const YourMessContainer = ({ Mess }) => {
  const OtherUserName = useSelector((store) => store.AnnRecip.recipName);
    const [isExpanded, setIsExpanded] = useState(false);
    const messageRef = useRef(null);
  
    const toggleReadMore = () => {
      setIsExpanded(!isExpanded);
    };
  

    // Auto scroll 
    useEffect(() => {
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [isExpanded, Mess]);
  
  
    const charLimit = 100;
  

  
    return (
      <div className="flex items-center justify-end p-[3px] w-full h-auto " ref={messageRef} >
      <div className="bg-teal-950/90 p-2 rounded-md flex flex-col max-w-[55%] sm:max-w-[75%]">
        <div className="text-white" >
          <p className={` break-all whitespace-pre-wrap break-words ${!isExpanded ? 'max-h-[5em] overflow-hidden' : ''}`}>
            {isExpanded ? Mess : `${Mess.substring(0, charLimit)}${Mess.length > charLimit ? '...' : ''}`}
          </p>
          {Mess.length > charLimit && (
            <span
              className="text-blue-500 cursor-pointer ml-2"
              onClick={toggleReadMore}
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </span>
          )}
        </div>
      </div>
    </div>
    );
  };

const TheirMessContainer = ({ Mess }) => {
    const OtherUserName = useSelector((store) => store.AnnRecip.recipName);
    const [isExpanded, setIsExpanded] = useState(false);
    const messageRef = useRef(null);
  
    const toggleReadMore = () => {
      setIsExpanded(!isExpanded);
    };
  
    const charLimit = 100;
  
    // Auto scroll 
    useEffect(() => {
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [isExpanded, Mess]);
  
    return (
      <div className="flex items-center p-[3px] w-full h-auto " ref={messageRef} >
        <div className="bg-sender p-2 rounded-md flex flex-col max-w-[55%]  sm:max-w-[75%]">
          <div className="text-white " >
            <p className={` break-all  whitespace-pre-wrap break-words ${!isExpanded ? 'max-h-[5em] overflow-hidden' : ''}`}>
              {isExpanded ? Mess : `${Mess.substring(0, charLimit)}${Mess.length > charLimit ? '...' : ''}`}
            </p>
            {Mess.length > charLimit && (
              <span
                className="text-blue-500 cursor-pointer ml-2"
                onClick={toggleReadMore}
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

 export default MessageContainer;