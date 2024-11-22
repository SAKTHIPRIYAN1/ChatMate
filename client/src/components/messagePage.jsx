import axios from 'axios';

import ClipIc from "./svg";
import { Similey } from "./svg";
import ConcatDescrip from "./contactDescrip";
import { SendIc } from "./svg";
import ChatTimer from "./ChatTimer";
import { useNavigate } from "react-router-dom";

import { useRef } from "react";
import { useState,useEffect } from "react";

//  chat Person slice from store...

import { alter } from "../Store/RegisterUser";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addNewAnnonMess,clearAnnonMess } from "../Store/AnnonymousMessages";
import { ClearAnnonRecip } from "../Store/AnonymousUser";
// Arrow....
import { ArrowLeftIcon } from "./svg";

// import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

// for using socket from the context provider...
import { useSocket } from "../SocketContext";


// loading,err,userinfo from the customhook...
import ChangePersonHook from "../CustomHooks/ChangePersonHook";
import Load from "./Loader";

// Loader...
import { LoadingProvider, useLoading } from "./Loadingcontext";


// maincaht..
import MainChat from "./MainChat";

// redierct..
import useRegRedirect from "../CustomHooks/RegRedirectMethod";


// my emojipicker...
import MyEmojiPicker from "./EmojiPicker";

const VITE_BACKURL = import.meta.env.VITE_BACKURL;

const MessagePart=()=>{
    const val=useSelector((store)=>store.AnnRecip.hasRecip);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {socket}=useSocket();

    useEffect(()=>{
        if(!val){
            navigate("/register");
            dispatch(alter([]));
            console.log('trrr')
        }
    },[])

    useEffect(()=>{
        if(socket!=null){
            socket.on("senderDisconnected", () => {
                console.log("Receiver Disconnected....");
                dispatch(clearAnnonMess());
                dispatch(ClearAnnonRecip())
                navigate("/register");
            });
        }
    },[socket]);

    
    
    return (
        <LoadingProvider>
            <MessComp />
        </LoadingProvider>
      );

   
}

const MessComp=()=>{
    const {loading}=useLoading();
    if(loading){
        console.log("loadingggg....");
        return(<Load />)
    }

    return(
        <div className="h-[100vh]   w-[100vw] fixed right-0 left-0 top-0  gap-0 border-none  bg  p-0 flex">
            <ConcatDescrip  />
            <MessContain />
        </div>
    )
}

const MessContain=()=>{
    const ChatPerson=useSelector((store)=>store.AnnRecip.recipName);
    const mainRef=useRef(null);
    const [ScrollToBottom,setScrollBotttom]=useState(false);

    useEffect(()=>{
        if(mainRef.current){
            mainRef.current.scrollTo({
                top: mainRef.current.scrollHeight, 
                behavior: 'smooth',
              });
        }
    },[ScrollToBottom]);

    
    return(
        <div className="h-full w-[70%] sm:w-[100%] relative ">
        <MessHead ChatPerson={ChatPerson}/>
        <MainChat reff={mainRef} ChatPerson={ChatPerson}/>
        <TyperDiv  scrollfunc={setScrollBotttom} />
        </div>
    )
}



const MessHead=({ChatPerson})=>{

    const navigate=useNavigate();
    const {setLoading}=useLoading();
    const { ChangePerson } = ChangePersonHook({setLoading});
    const {socket}=useSocket();
    const dispatch=useDispatch();
    const sockid=useSelector((store)=>store.UserReg.socketId)

    const handleNext=()=>{
        setLoading(true);
        ChangePerson(setLoading);
    }

    const handleRedirect=()=>{
        console.log('j1');
        useRegRedirect({dispatch,socket,sockid});
    }

    return(
        <div className=" flex transparent_tone justify-between flex-row w-full px-3 h-[45px] ">
            <div className="h-full fill-white hidden sm:flex sm:mr-3 hover:cursor-pointer   active:scale-90 transition-all items-center" onClick={()=>{navigate("/register");handleRedirect();}}>
                <div className="hover:bg-teal-900/40 rounded-full p-[7px]  ">
                <ArrowLeftIcon />
                </div>
            </div>
           <div className="h-[100%] w-[122px] flex-1 justify-start flex items-center  "> 
                <h1 className="text-teal-200 font-semibold text-lg cursor-pointer truncate">
                    {ChatPerson}
                </h1>
           </div>
           <div className="h-full hidden sm:flex items-center min-w-[100px] gap-3 justify-between">
                <button className="button px-5 w-auto bg-sender rounded-full">
                    save
                </button>

                <button className="button px-5 w-auto rounded-full bg-teal-950/90" onClick={handleNext}>
                    next
                </button>
           </div>

           <div className="sm:hidden">
                <ChatTimer /> 
           </div>
        </div>
    )
}

const TyperDiv = ({scrollfunc}) => {

    // forsocket....
    const {socket}=useSocket();
    const ReceiverSock=useSelector((store)=>store.AnnRecip.recipSock);

    const dispatch=useDispatch();

    // statesss...
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    const [isPickerVisible,setVisible]=useState(false);

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

    const handleSend=()=>{
        if(message.length<=0)
            return;

        console.log(message)
        socket.emit("sendMess",{message,ReceiverSock});
        console.log("message sent");
        dispatch(addNewAnnonMess({isYou:true,mess:message,isFile:false}));
        textareaRef.current.style.height = 'auto';
        textareaRef.current.focus();
        scrollfunc((cur)=>{
            console.log(cur);
            return !cur;
        });
        setMessage('');

        
    }
    let pt = textareaRef.current && textareaRef.current.scrollHeight > 45 ? 'mt-3' : '';

    const emofunc=()=>{
            setVisible(!isPickerVisible)
    }

    const FileRef=useRef(null);
    
    
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = async (e) => {
        console.log("Trying to send file...\n");
        const file = e.target.files[0];
        if (!file) return;
    
        try {
            console.log(file)
            // Create form data
            const formData = new FormData();
            formData.append('file', file);
            formData.append('receiverSocket',ReceiverSock); 
            formData.append('filename',file.name);
    
            // Send the file to the server using Axios
            const resp = await axios.post(VITE_BACKURL+"/file/Annon", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('File successfully uploaded:', resp.data);
            const filePath=resp.data.filePath
             socket.emit('sendFile',{filePath,name:file.name,receiverId:ReceiverSock})

            //  adding file to the front end...
            dispatch(addNewAnnonMess(
                {
                    isYou:true,
                    mess:'file1',
                    isFile:true,
                    path:filePath,
                    filename:file.name
                }
            ))
            
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    };


  
    return (
        <div className="flex typ w-[100%] px-4 bottom-0 right-0 left-0 absolute  h-auto min-h-[45px] ">
            <div className="min-h-[45px] h-auto flex items-end mr-4" onClick={()=>{FileRef.current.click();}}>
                <ClipIc />
                <input type="file" name="file" id="" className="hidden" ref={FileRef} onChange={handleFileChange} />
            </div>

            <textarea
                autoFocus={true}
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                placeholder="Enter your message..."
                name="message"
                id="mess"
                className={`resize-none  my-auto bg-transparent w-[100%] flex-1  flex outline-none  overflow-hidden ${pt}` }
                rows={1}
                style={{ maxHeight: '150px' }}
            />

            <div className="min-h-[45px] h-auto flex items-end  mr-2 gap-4 ml-4">
                <div onClick={emofunc}>
                    <Similey />
                </div>
                {
                    isPickerVisible && <EmojiPicker pbt={setVisible}  func={setMessage} val={message}  />
                }
                
                <div onClick={handleSend}>
                    <SendIc />
                </div>
            </div>

        </div>
    );
};


const EmojiPicker=({pbt,func,val})=>{
    const pickerRef=useRef(null);


    return(

            <div ref={pickerRef} className={"absolute   right-0 bottom-[100%] mb-2"}>
                <MyEmojiPicker func={func} val={val} />
            </div>

    )
}



export default MessagePart;


