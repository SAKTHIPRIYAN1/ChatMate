import axios from "axios"

import toast from "react-hot-toast";
import { setUser,setUserAuth } from "./Store/AuthUser";
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

export const makeToast=(str,code)=>{
    if(code==200){
        toast.success(str, {
            duration: 3000,
            position: 'top-right',
            
              style: {
              color: '#fff',
              backgroundColor:'rgba(39, 50, 73, 0.934)',
              },
            });
        return;
    }

    toast.error(str, {
        duration: 3000,
        position: 'top-right',
        
          style: {
          color: '#fff',
          backgroundColor:'rgba(39, 50, 73, 0.934)',
          },
        });
};


