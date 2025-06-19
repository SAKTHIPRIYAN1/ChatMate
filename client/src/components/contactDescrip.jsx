
import AnnonChatDet from "./AnnonymsConcatDet";
import {GlobeIc,UserIc,EditIC,MenuIc,ReqIcon} from "./svg";
import { useSelector,useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LoginIc,LogOutIc } from "./svg";
import { ClearUser } from "../Store/AuthUser";

import { makeToast } from "../simpleFunctions";
import { useRef } from "react";
import svg from '../assets/imag.png'
import axios from "axios";
import { useState } from "react";
import store from "../Store/store";
const VITE_BACKURL = import.meta.env.VITE_BACKURL;


const ConcatDescrip=({loading,setLoading})=>{

    const isVisi=useSelector((store)=>store.AnnonDes.isVisi);
    console.log(isVisi)
    return (
        <>
        <div className="contactContain select-none flex sm:hidden h-[100%] w-[35%] min-w-[400px]  ">
            <MenuBar />
            <AnnonChatDet  />
        </div>
        <div className={`contactContain select-none  hidden  h-[100%] w-full  absolute z-20 min-w-[400px] ${+isVisi?" sm:flex":''}` }>
            <MenuBar />
            <AnnonChatDet  />
        </div>
       </>
    )
};

export const MenuBar=()=>{
    let MenuArr=[
        {
        ic:MenuIc,
        des:null,
        link:"/",

        },
        {
            ic:GlobeIc,
            des:"GChat",
            link:"/register",

        },
        {
            ic:UserIc,
            des:"Contacts",
            link:"/contacts",

        },
        {
            ic:ReqIcon,
            des:"Request",
            link:"/requests",

        },

    ]

    const [isHover,setHover]=useState(false);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    // for checking Login status...
    // const logRef =useRef(null);
    const {profilePic}=useSelector((store)=>store.User);
    console.log(profilePic);

    const isLoggedin=useSelector((store)=>store.User.isLoggedin);
    console.log(isLoggedin);
    const handleClick=async ()=>{
        console.log("clicked....");
        if(!isLoggedin){
            console.log("nav to login Page..");
            navigate("/login");
            return;
        }
        try{
            const res=await axios.get(`${VITE_BACKURL}/logout`,{withCredentials:true});
            console.log(res.data.msg);
            makeToast(res.data.msg,200);
        }
        catch(err){
            makeToast(err?.response?.msg || "Internal Server Error",500);
            console.log(err?.response?.msg)
        }
        finally{
            dispatch(ClearUser());
            console.log("logout");
        }

      

    }
    return(
        <div className="h-[100%]  sm:hidden w-[85px] transition-all transparent justify-between pb-4 flex flex-col gap-0"> 
            <div className="flex flex-col   w-ful">
                    {
                        MenuArr.map((el,ind)=>{
                            return (
                                    <Link to={el.link}  key={ind}>
                                    <MenuContent cont={el.ic}  des={el.des} />
                                    </Link>
                            )
                        })
                    }
            </div>
            <div className=" w-full gap-3 justify-center flex flex-col items-center">
            <div onMouseEnter={()=>setHover(true)}  onMouseLeave={()=>setHover(false)} className="relative   flex hover:cursor-pointer hover:opacity-90  w-full justify-center" onClick={handleClick}>
                    {
                        isLoggedin ? (
                            <div className="flex flex-col w-full gap-6 mb-2 items-center">
                                <LogOutIc />
                            </div>
                        ): <LoginIc />
                    }
                    {
                        isHover && (
                            <div className="absolute animate-popup -mr-[100px]  flex items-center -top-[2px] bg-slate-600/70 px-2 py-1 rounded-xl">
                                <p className="text-[14px]" >
                                {
                                    isLoggedin ? "Logout":"Login"
                                }
                                </p>
                            </div>
                        )
                    }
            </div>
           {
            isLoggedin &&
            <Link to={"/profile"}>
                <div className="h-12 w-12 max-h-12 max-w-12  rounded-full z-30 overflow-hidden">
                                    <img src={profilePic?VITE_BACKURL+profilePic:svg} className="object-cover border-[1.5px] border-slate-300 rounded-full" />
                </div>
            </Link>
           }
            </div>
        </div>
    )
}

export const MenuContent=(prop)=>{
    const Icon=prop.cont;
    const Des=prop.des



    return (
            <div className="w-full   py-[13px] opacity-60 hover:opacity-100 hover:cursor-pointer hover:text-teal-300  flex  justify-center" >
                <div className="flex flex-col w-full   text-center items-center">
                    <Icon />
                    <h2 className="text-[13px] mt-1 c font-sans">
                        {Des}
                    </h2>
                </div>
            </div>
    )
}

export default ConcatDescrip;