import axios from "axios"
import { use } from "react";
const VITE_BACKURL = import.meta.env.VITE_BACKURL;

import { useSelector } from "react-redux";

export const PreAuth=async (purpose)=>{
    try{
        const req=await axios.post(VITE_BACKURL+'/preauth',{Purpose:purpose},{
            withCredentials:true,
        });
        console.log(req);
        return 200;
    }
    catch(err){
        return 500;
    }
};

