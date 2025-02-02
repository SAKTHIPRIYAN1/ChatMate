import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";

import { useSocket } from "../SocketContext";

import { setAnnonymousPair,ClearAnnonRecip } from "../Store/AnonymousUser";
import { clearAnnonMess } from "../Store/AnnonymousMessages";

import { setUserSock } from "../Store/RegisterUser";

import RandomPass from "./RandomPass";
import toast from "react-hot-toast";
const ChangePersonHook=({setLoading})=>{

    const [err,setErr]=useState("");
    const {socket}=useSocket();
    const dispatch=useDispatch();

    // value from the store....
    const name=useSelector((store)=>store.UserReg.name);
    const interest=useSelector((store)=>store.UserReg.interest)
    const sockid=useSelector((store)=>store.UserReg.socketId)

    const UserId=useSelector((store)=>store.User.id);
    
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
                toast.error("No Pair Found", {
                    duration: 3000,
                    position: 'top-right',
                    
                      style: {
                      color: '#fff',
                      backgroundColor:'rgba(39, 50, 73, 0.934)',
                      },
                    });
                console.log("NO PAIR FOUND....")
                setLoading(false);
            }
        }
        catch(err){
            console.log("handleAck err",err);
        }
        
        };

        // Listen .......
        if (socket) {
            socket.on("ack", handleAckow);
        }

        
    }, [socket])

  const ChangePerson = () => {
        dispatch(ClearAnnonRecip());
        try{
        console.log("changing person");
        dispatch(clearAnnonMess())
        const pass=RandomPass.GenerateRandomPass()
        socket.emit("changeperson", { sockid, name, interest,pass,UserId});
        }
        catch(err){
            console.log("change err:",err);
        }
        
    };


    return {err,ChangePerson};
}


export default ChangePersonHook;