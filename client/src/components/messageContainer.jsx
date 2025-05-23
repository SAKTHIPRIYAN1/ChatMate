import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";

import axios from 'axios';
const VITE_BACKURL = import.meta.env.VITE_BACKURL;
import { FileIcon } from './svg';
import MessOptions from './MessageOptions';

import { MenuDownIcon } from './svg';


const HandleMenuOptions=(e)=>{
  console.log("menu Clickd for a message:",e);
}

 const MessageContainer=({isYou,Mess,Main})=>{
    return(
        <div className='relative'>
            {
                isYou ? <YourMessContainer Mess={Mess} Main={Main} /> : <TheirMessContainer Mess={Mess} Main={Main} />
            }
            
        </div>
    )
 }


 const getMenuPosition = (messageRef) => {
  if (!messageRef.current) return "bottom";

  const { top, bottom } = messageRef.current.getBoundingClientRect();
  const height = window.innerHeight;

  if (top < height * 0.3) return "bottom"; // Near top
  if (bottom > height * 0.7) return "top"; // Near bottom
  return "center"; // Somewhere in middle
};


 const YourMessContainer = ({ Mess,Main }) => {
  const OtherUserName = useSelector((store) => store.AnnRecip.recipName);
    const [isExpanded, setIsExpanded] = useState(false);
    const messageRef = useRef(null);
    const [Options ,setOptions]=useState(false);
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
  

    const handleFileDownload = async (filePath, customFilename) => {
      try {
        // Make a GET request to the server to fetch the file
          const response = await axios.get(`${import.meta.env.VITE_BACKURL}${filePath}?filename=${encodeURIComponent(customFilename)}`, {
          responseType: 'blob', // Important for handling the file as a binary large object (Blob)
        });
    

        const link = document.createElement('a');
        link.href = URL.createObjectURL(response.data); 
        link.download = customFilename; // Set the custom filename
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link); 
    
        console.log('File downloaded:', customFilename);
      } catch (error) {
        console.error('Error downloading the file:', error);
      }
    };

    const handleClick=()=>{

    }
  
    return (
      <div  className="flex items-center justify-end p-[3px] group relative w-full cursor-pointer h-auto " ref={messageRef} >
        <div className="absolute text-gray-300 opacity-40 hidden group-hover:block top-2 right-2 bg-transparent" onClick={(e)=>handleClick}>
        <MenuDownIcon />
        </div>


      <div className="bg-teal-950/90 p-2 rounded-md flex flex-col max-w-[55%] pr-10 sm:max-w-[75%]">


      {
      Main['isFile'] ?

              <div className='h-13 min-w-[200px]  gap-4 pr-2 items-center flex'>
                  <div className='h-[45px] w-[45px] rounded-full bg-teal-900 flex items-center justify-center'>
                    <FileIcon />
                  </div>
                  <div className='h-full w-full'>
                    <h2>{Main.filename}</h2>
                    <a
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the default behavior (navigating to the file URL)
                        handleFileDownload(Main.path, Main.filename); // Call the download function
                      }}
                      className="font-bold text-teal-600/90 hover:underline hover:cursor-pointer"
                      download={Main.filename}
                    >
                      Download 
                    </a>
                  </div>
              </div>
            :
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
      }  

      </div>
    </div>
    );
  };

const TheirMessContainer = ({ Mess,Main }) => {
    const OtherUserName = useSelector((store) => store.AnnRecip.recipName);
    const [isExpanded, setIsExpanded] = useState(false);
    const messageRef = useRef(null);
    const [Options,setOptions]=useState(false)
    const toggleReadMore = () => {
      setIsExpanded(!isExpanded);
    };
  
    const charLimit = 100;
  
    const handleFileDownload = async (filePath, customFilename) => {
      try {
        // Make a GET request to the server to fetch the file
        const response = await axios.get(`${import.meta.env.VITE_BACKURL}${filePath}?filename=${encodeURIComponent(customFilename)}`, {
          responseType: 'blob', // Important for handling the file as a binary large object (Blob)
        });
    

        const link = document.createElement('a');
        link.href = URL.createObjectURL(response.data); 
        link.download = customFilename; // Set the custom filename
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link); 
    
        console.log('File downloaded:', customFilename);
      } catch (error) {
        console.error('Error downloading the file:', error);
      }
    };

    // Auto scroll 
    useEffect(() => {
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [isExpanded, Mess]);
  
    return (
      <div className="flex items-center justify-start p-[3px] group  w-full h-auto cursor-pointer " ref={messageRef} >
      <div className="bg-sender p-2 rounded-md flex flex-col max-w-[55%] relative pr-10  sm:max-w-[75%]">
      <div className="absolute text-gray-300 opacity-40 hidden group-hover:block top-2 right-2 bg-transparent" onClick={(e)=>{setOptions(!Options)}                           } > 
        <MenuDownIcon />
        </div>

      {
      Main['isFile'] ?

              <div className='h-13 min-w-[200px]  gap-4 pr-2 items-center flex'>
                  <div className='h-[45px] w-[45px] rounded-full bg-slate-700 flex items-center justify-center'>
                    <FileIcon />
                  </div>
                  <div className='h-full w-full'>
                    <h2>{Main.filename}</h2>
                    <a
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the default behavior (navigating to the file URL)
                        handleFileDownload(Main.path, Main.filename); // Call the download function
                      }}
                      className="font-bold text-teal-600/90 hover:underline hover:cursor-pointer"
                      download={Main.filename}
                    >
                      Download 
                    </a>




                  </div>
              </div>
            :
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
      }  

      </div>
    </div>
    );
  };

 export default MessageContainer;