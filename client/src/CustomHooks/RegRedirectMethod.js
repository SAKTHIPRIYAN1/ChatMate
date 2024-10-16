import { useEffect, useState } from "react";
import { useSocket } from "../SocketContext";
import { useDispatch,useSelector } from "react-redux";
import { ClearAnnonRecip } from "../Store/AnonymousUser";
import { clearAnnonMess } from "../Store/AnnonymousMessages";
import { useNavigate } from "react-router-dom";

const useRegRedirect=({dispatch,socket,sockid})=>{
    console.log("hiii");
    // socket connection to disconnect and to connect......

    // clearing the valus in the store...
    dispatch(clearAnnonMess());
    dispatch(ClearAnnonRecip());
        
        if(socket){
            socket.emit("ReUser",{sockid});
        }

    console.log('jjjj');
        
}

export default useRegRedirect;

