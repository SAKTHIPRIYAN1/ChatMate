import svg from "../assets/imag.png";
import { useSelector,useDispatch } from "react-redux";
import ChangePersonHook from "../CustomHooks/ChangePersonHook";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { setDesVisible } from "../Store/AnnonDesslice";
import { ArrowLeftIcon } from "./svg";
// useloadinggg...
import { useLoading } from "./Loadingcontext"; 

import { useSocket } from "../SocketContext";
// for redirect to reg page..



import useRegRedirect from "../CustomHooks/RegRedirectMethod";
import axios from "axios";


import RandomPass from "../CustomHooks/RandomPass";
import store from "../Store/store";


// toast importing...
import toast from "react-hot-toast";


const VITE_BACKURL = import.meta.env.VITE_BACKURL;
const AnnonChatDet=()=>{
    const val=useSelector((store)=>store.AnnRecip.hasRecip);
    const navigate=useNavigate();

    useEffect(()=>{
        if(!val){
            navigate("/register");
            console.log('trrr');
        }
    },[])



    return(
        <>
        <div className="h-full w-full border-x-[1px]   border-x-slate-950  sm:absolute sm:z-30 sm:animate-slideRight sm:bg-[#0e1118] shadow-slate-900 shadow-sm  transparent_tone">
                    {/* <SearchBar /> */}
                    <AnnonDes  />
        </div>  
        </>
                

    )
}

const SearchBar=()=>{
    return(
        <div className="w-auto bg-slate-600/80 rounded-full h-10 mx-4 my-1">
            <input type="text" placeholder="Search" name="search" id="srch" className="h-full p-4  w-[95%] bg-transparent outline-none" />
        </div>
    )
};

const AnnonDes=()=>{


    const dispatch=useDispatch();
    const {socket}=useSocket();
    
    const sockid=useSelector((store)=>store.UserReg.socketId);

    const {setLoading}=useLoading();

    const { ChangePerson } = ChangePersonHook({setLoading});
    const RecipName=useSelector((store)=>store.AnnRecip.recipName);
    const InterestArr=useSelector((store)=>store.AnnRecip.recipInter);
    console.log(RecipName,InterestArr);

    const [saved,setSave]=useState(false);

    const handleNext=()=>{
        setLoading(true);
        ChangePerson(setLoading);
    }

    const navigate=useNavigate();

    const handleRedirect=()=>{
        useRegRedirect({dispatch,socket,sockid});
    };

    // getting the user if logged in from store or try to get the unique pass from the local storageee....
    // If not there ,, create a new pass

        const isLoggedin=useSelector((store)=>store.User.isLoggedin);
        const sendPass=RandomPass.GenerateRandomPass();
        const sendId=useSelector((store)=>store.User.id);

        const recipPass=useSelector((store)=>store.AnnRecip.recipPass);
        const recipId=useSelector((store)=>store.AnnRecip.recipId);

        const sendName=useSelector((store)=>store.UserReg.name);
        const recvName=useSelector((store)=>store.AnnRecip.recipName);

        const recipSock=useSelector((store)=>store.AnnRecip.recipSock);
    const handleSave=async ()=>{
        let annonymous=[];
        const recvAuth=recipId?recipId:recipPass;
        const sendAuth=isLoggedin?sendId:sendPass;
        

        // console.log(sendAuth,recipAuth,sendName,recvName);

        if(!isLoggedin){
            annonymous.push("sender");
        }

        if(!recipId){
            annonymous.push("receiver");
        }


        try{
            const res=await axios.post(VITE_BACKURL+"/saveUser",{sender:sendName,receiver:recvName,sendAuth,recvAuth,annonymous,recipSock},{withCredentials:true});
            console.log(res.data.msg);
            toast.success(res.data.msg, {
                duration: 3000,
                position: 'top-right',
                
                  style: {
                  color: '#fff',
                  backgroundColor:'rgba(39, 50, 73, 0.934)',
                  },
                });
            setSave(true);
            console.log("Request Sent Successfully.....");
        }
        catch(err){
                toast.error(err.response.data.msg, {
                    duration: 3000,
                    position: 'top-right',
                    
                      style: {
                      color: '#fff',
                      backgroundColor:'rgba(39, 50, 73, 0.934)',
                      },
                    });
                console.log("error:",err.response.data);
        }
    }

    return(
        <div className="h-full w-full flex  overflow-scroll pb-8 items-center flex-col mt-3">
            <div className="flex flex-row items-center  w-full justify-center relative">
                <div className="absolute left-2 fill-white hover:cursor-pointer  p-[6px] rounded-full hover:bg-teal-900/90  active:scale-90" onClick={()=>{dispatch(setDesVisible(false))}} >
                    <ArrowLeftIcon />
                </div>
                <h1 className="font-bold  text-2xl" > USER <span className="text-teal-300" >DESCRIPTION</span></h1>
            </div>
            <div className="flex   flex-col w-full items-center mt-5 md:px-2 px-4" >
                <div className="relative bg-gray-700   flex justify-center items-center h-auto p-2 rounded-full w-auto">
                    <img className="h-[140px] " src={svg} alt="loading....." draggable="false" />
                </div>

                <div className="mt-4  flex-col text-center">
                    <h1 className="font-bold text-xl  mb-0 p-0">{RecipName}</h1>
                    <h1 className="italic text-md font-sans p-0 h-auto text-gray-400 -mt-[7px]">A anonyous User</h1>
                </div>
            </div>

        <div className=" pb-5 max-w-[450px] w-[100%] flex flex-col  px-8  pt-2   md:px-2">
        <h1 className="block  text-teal-300 text-md  font-bold mb-3">Interests</h1>
            <PreferenceButtons arr={InterestArr} />
        </div>
        
        <div className="w-full  px-7 md:px-2 flex-col" >
        <h1 className="block  text-teal-300 text-md  font-bold ">Choices</h1>
        <div className="h-full items-center flex  gap-3 justify-between">
        <button className="button px-5 w-[50%] h-10 text-lg max-w-[200px]  rounded-full bg-teal-900/90" onClick={handleNext}>
                    Next
        </button>
                
        {
            !saved?<button className="button w-[50%] px-5  h-10 text-lg max-w-[200px] bg-sender rounded-full" onClick={handleSave}>
            Save
            </button>
            :
            <button className="button active:scale-100 w-[50%] px-5  h-10 text-lg max-w-[200px] hover:cursor-not-allowed bg-slate-600 opacity-65 rounded-full" >
            Requested..
            </button>
        }

                
           </div>

        </div>
        
        </div>
            
    )
}


const PreferenceButtons = ({arr}) => {
    return (
        <div className="flex p-4 py-5 bg-slate-600/30 w-[100%] sm:flex-col sm:items-center   rounded-lg shadow-md justify-evenly">
            { arr.map(preference => (
                <button
                    key={preference}
                    className={"px-4 text-[15px] py-2 rounded-lg border active:scale-95 sm:mt-3 border-gray-300  sm:w-[50%] cursor-pointer transition-colors duration-300 ease-in-out "}
                >
                    {preference}
                </button>
            ))
        }
            
        </div>
    );
}


export default AnnonChatDet;