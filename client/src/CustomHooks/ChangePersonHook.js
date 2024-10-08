import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";

import { useSocket } from "../SocketContext";

import { setAnnonymousPair,ClearAnnonRecip } from "../Store/AnonymousUser";
import { clearAnnonMess } from "../Store/AnnonymousMessages";

import { setUserSock } from "../Store/RegisterUser";

const ChangePersonHook=({setLoading})=>{

    const [err,setErr]=useState("");
    const {socket}=useSocket();
    const dispatch=useDispatch();

    // value from the store....
    const name=useSelector((store)=>store.UserReg.name);
    const interest=useSelector((store)=>store.UserReg.interest)
    const sockid=useSelector((store)=>store.UserReg.socketId)

    
    useEffect(() => {
        // Clean up listener when the component unmounts
        console.log("handleAck")

        const handleAckow= ({ code, UserInfo,socketId }) => {
        try{
            if (code==200) {
                console.log(code + "kkkk");
                console.log("stop load..", UserInfo);
                dispatch(setAnnonymousPair(UserInfo));
                setLoading(false);
                dispatch(setUserSock(socketId))
                console.log("set to false...")
            } else {
                console.log("NO PAIR FOUND....")
                setLoading(false);
            }
        }
        catch(err){
            console.log("handleAck err",err);
        }
        
        };

        // Listen 
        if (socket) {
            socket.on("ack", handleAckow);
        }

        
    }, [socket]); 


  const ChangePerson = () => {
        dispatch(ClearAnnonRecip());
        try{
        console.log("changing person");
        dispatch(clearAnnonMess())
        socket.emit("changeperson", { sockid, name, interest });
        }
        catch(err){
            console.log("change err:",err);
        }
        
    };


    return {err,ChangePerson};
}


export default ChangePersonHook;