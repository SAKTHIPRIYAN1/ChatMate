import { useState,useEffect } from "react";
import { MessHead} from "./messagePage";
import { useSelector } from "react-redux";
import { useRef } from "react";
import MainChat from "./MainChat";
import { EmojiPicker } from "./messagePage";
import { useSocket } from "../SocketContext";
import { useDispatch } from "react-redux";
import ClipIc from "./svg";
import { Similey,SendIc  } from "./svg";
import axios from "axios";
import store from "../Store/store";
import { setMessages } from "../Store/ContactSlice";
import { GetContactMessages } from "../Store/ContactSlice";
import { useLocation } from "react-router-dom";
import ContactProfile from "./contactprofile";

import { setAlterContactOpen } from "../Store/AuthUser";


const VITE_BACKURL=import.meta.env.VITE_BACKURL;

const MainMessageContain =()=>{
    
    const {name,Auth,isEmpty,isAboutOpen}=useSelector((store)=>store.Contact);

    const {isContactOpen}=useSelector((store)=>store.User);
    
    console.log(isAboutOpen);

    const mainRef=useRef(null);
    const [ScrollToBottom,setScrollBotttom]=useState(false);

    const location = useLocation();
    

    useEffect(()=>{
        if(mainRef.current){
            mainRef.current.scrollTo({
                top: mainRef.current.scrollHeight, 
                behavior: 'smooth',
              });
        }
    },[ScrollToBottom]);
    
    if(!Auth||isEmpty){
       
        return (
            <div className=" h-full flex justify-center w-[65%] items-center ">
                    <div className="bg-slate-800/80 p-1 px-3 rounded-xl">
                        <h1>
                            Select the Contact to start Messaging
                        </h1>
                    </div>
            </div>
        );
    }
    
    return(
        <>
        
            <div className={isContactOpen?"sm:absolute right-0 h-full w-[65%]   sm:w-full relative jj left-0 z-40 ":"hidden"}>
                <MessHead ChatPerson={name} noTimer={true} isAbout={true} />
                <MainChat reff={mainRef} ChatPerson={name}  />
                <TyperDiv  scrollfunc={setScrollBotttom} />
            </div>

        {
            isAboutOpen ?
         <div className="w-[35%] sm:hidden border-l-[0.5px] border-slate-700 bg-transparent_tone">
            <ContactProfile />
        </div>:<></>
        }
            

        </>
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

    // AUTH and IDs...
        const SendAuth=useSelector((store)=>store.User.Auth);
        const ContactAuth=useSelector((store)=>store.Contact.Auth);
        const chatId=useSelector((store)=>store.Contact.chatId);


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

  const handleSend= async ()=>{
        if(message.length<=0)
            return;
        console.log(message);
        try{
            const res=await axios.post(`${VITE_BACKURL}/Message/sendMessage`,{
               sender:SendAuth,
                receiver:ContactAuth,
                chatId,
                message
            },{withCredentials:true});
        }catch(err){
            console.log("error Occured::",err?.response?.msg);
        }finally{
            dispatch(GetContactMessages());
            setMessage("");
            // scroll o bottom for every send......
            scrollfunc((cur)=>{
                console.log(cur);
                return !cur;
            });
        }
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
            console.log(file);
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('auth', ContactAuth);
            formData.append('filename', file.name);
            formData.append('data', JSON.stringify({
                sender: SendAuth,
                receiver: ContactAuth,
                chatId,
                message: "file Upload",
            }));
        
            // Send the file 
            const resp = await axios.post(`${VITE_BACKURL}/file/Chat`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        
            console.log('File successfully uploaded:', resp.data);
            
            const filePath = resp.data.filePath; // Ensure this is received
        
            // Emit event 
            socket.emit('sendFileChat', { 
                filePath, 
                name: file.name, 
                Auth: ContactAuth 
            });
            
            dispatch(setMessages({
                isYou: true,
                mess: 'file1',
                isFile: true,
                path: filePath,
                filename: file.name
            }));
        
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

export default MainMessageContain;