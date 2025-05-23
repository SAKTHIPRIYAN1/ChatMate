
export const SearchBar=()=>{
    return(
        <div className="w-auto bg-slate-600/80 rounded-full h-10 mx-3 my-1">
            <input type="text" placeholder="Search" name="search" id="srch" className="h-full p-4  w-[95%] bg-transparent outline-none" />
        </div>
    )
};

import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import svg from "../assets/imag.png"
const VITE_BACKURL =import.meta.env.VITE_BACKURL;
const VITE_IMAGE_BACKURL =import.meta.env.VITE_IMAGE_BACKURL;
import Load from "./Loader";
import { useLoading } from "./Loadingcontext";
import { useState } from "react";
// import { Link } from "react-router-dom";
import { setContact } from "../Store/ContactSlice";

import { setAlterContactOpen } from "../Store/AuthUser";

const ContactComponent=()=>{
    const Auth=useSelector((store)=>store.User.Auth);
    const conAuth=useSelector((store)=>store.Contact.isEmpty);
    const conName=useSelector((store)=>store.Contact.name);
    const {loading,setLoading}=useLoading();

    const [contacts,setContacts]=useState([]);
    
    useEffect(()=>{
        async function getContacts(){
            try{
                setLoading(true);
                const res=await axios.get(VITE_BACKURL+"/contact/"+Auth,{withCredentials:true});
                console.log(res.data?.data);
                if(res.data.data){
                    setContacts(res.data.data);
                    // console.log(contacts);
                }
            }
            catch(err){
                console.log(err.response?.data?.msg);
            }
            finally{
                setLoading(false);
            }
        }

        getContacts();
    },[conAuth,conName]);

    if(loading){
        return <Load />
    }

    return (
        <>
        <div className="h-full w-full  border-x-[1px] sm:bg-transparent pt-[1px] border-x-slate-950  sm:absolute sm:z-30 sm:animate-slideRight sm:bg-[#0e1118] shadow-slate-900 shadow-sm  transparent_tone">
                    <div className="sm:hidden">
                    <SearchBar />
                    </div>
                    
                <div className="contactDiv mt-2 h-full overflow-y-scroll ">
                    {
                        contacts.map((el,ind)=>{
                            return (
                                <>
                                <Contact el={el} key={ind+1}/>
                                </>
                            );
                        })
                    }
                </div>
        </div>  
        </>
    );
};

const Contact=({el})=>{
    
    console.log(el);
    const [pr,setPr]=useState(null);
    useEffect(()=>{
        async function fet() {
            try{
                const res = await axios.post(`${VITE_BACKURL}/profile/getPic`,{user_id:el.Auth}, {
                    withCredentials: true,
                });
                const {profile}=res.data;
                if(profile)
                    setPr(profile);
            }
            catch(err){
                console.log(err);
            }
        }

        fet();
    },[])

    const dispatch=useDispatch();

    const timeDate=(timestamp)=>{
        const date = new Date(timestamp);
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
    
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    const handelContactClick=()=>{
        dispatch(setAlterContactOpen());
        dispatch(setContact(el));
    }

    return (
       <div  className=" cursor-pointer hover:bg-slate-700/30 h-max max-h-[100px] border-b-[1px] border-b-slate-700 py-[15px]    flex gap-2 pr-0 pl-0 " onClick={handelContactClick}>
        <div className="ml-3 flex h-max gap-2 items-center self-center  w-full"> 
            <div className="h-14 w-14 overflow-hidden rounded-full border-[1px] border-slate-500 bg-black ">
              <img src={pr? VITE_IMAGE_BACKURL+"/"+pr : svg } alt="ll" className=""/>
            </div>
            <div className="flex flex-col h-full  justify-center">
                <h1 className="font-bold text-white text-lg">{el.name}</h1>
                <h2 className="text-slate-400">Connected On {timeDate(el.date)}</h2>
            </div>
        </div>
       </div>
    );
}

export default ContactComponent;
