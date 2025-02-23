import { useState } from "react";
import img2 from '../assets/nn.svg'

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import axios from "axios";
const VITE_BACKURL = import.meta.env.VITE_BACKURL;

import { useDispatch } from "react-redux";
import { setUser } from "../Store/AuthUser";

import { useSelector } from "react-redux";

import api from "../CustomHooks/apiInstance";

import { useLoading } from "./Loadingcontext";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../Store/AuthUser";
const LoginPage=()=>{
    return(
        <div className=" fullas transition-all  flex justify-center">
            <LoginContainer />
        </div>
        
    )
}



const LoginContainer=()=>{
    return (
        <div className=" flex justify-between   w-[80%] sm:justify-center md:justify-center  z-0  my-auto  px-0 p-5 mx-[15%]  sm:mx-[5%]">
            <div className="flex imgDiv h-[100%]  sm:hidden md:hidden relative min-w-[300px] ">
                <img src={img2} alt="Load..." className="   select-none h-[700px] w-[100%] object-cover flex sm:hidden md:hidden " draggable="false" />
            </div>
            <div className="items-center flex mr-12 sm:mr-0 md:mr-0 sm:w-[90%] md:w-[70%] imgDiv   w-[50%] mx-2 min-w-[300px] "> 
                <LoginPart />
            </div>
        </div>
    )
}



const LoginPart=()=>{
    const [id,setId]=useState("");
    const [pass,setpass]=useState("");

    const {loading,setLoading}=useLoading();
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const Auth =useSelector((store)=>store.User.Auth);

    const hangleSubmit=async (e)=>{
        e.preventDefault();
        console.log(id,pass);
        try{
            setLoading(true);
            const res=await axios.post(VITE_BACKURL+"/login",{id,password:pass,Auth},{
                withCredentials: true,
            });
            console.log(res);
            const userData=res.data.data;
            userData["accessToken"]=res.data.accessToken;
            dispatch(setUser(userData));
            dispatch(getUserData());
            setLoading(false);
            console.log("Logged In...");
            
            setId("");
            setpass("");  
            navigate("/");
        }
        catch(err){
            setLoading(false);
            
            if(err.response && err.response.data){
                console.log(err.response.data);
                toast.error(err.response.data.msg, {
                    duration: 3000,
                    position: 'top-right',
                    
                      style: {
                      color: '#fff',
                      backgroundColor:'rgba(39, 50, 73, 0.934)',
                      },
                    });
            }else{
                console.log(err);
            }
        }
    }


    return(
        <div className="h-[600px]   max-w-[450px] w-[100%] flex flex-col  items-center sm:pt-0 md:pt-0 pt-5">
        <div className="transparent_blue pb-7 max-w-[450px] w-[100%] flex flex-col  items-center pt-4">
            <h1 className="text-[35px] text-emberlad-300 font-bold ">CHAT<span className='text-teal-300'>MATE</span></h1>
            <div className="w-[100%] pl-8">
                <form className="" onSubmit={(e)=>hangleSubmit(e)}>
                     <div className="my-6 w-full ">
                            <label className="block  text-teal-300 text-md  font-bold mb-2" htmlFor="name">UserId</label>
                            <input type="text" id="id" name="id" autoFocus={true} onChange={(e)=>{setId(e.target.value)}} value={id} placeholder="Enter your UserId" className=" w-[90%] px-3 py-2 bg-transparent border-[1.5px] text-white  border-slate-500 rounded-md focus:outline-none  focus:border-white/80" required />
                     </div>

                     <div className="mt-6 mb-3 w-full ">
                        <div className="flex justify-between w-[90%]">
                            <label className="block  text-teal-300 text-md  font-bold mb-2" htmlFor="name">Password</label>
                            <Link to={"/changePass"} className="block md:hidden whitespace-nowrap sm:hidden text-teal-300 italic text-md underline  font-bold mb-2" htmlFor="password">Change New Password?</Link>
                        </div>    
                            <input type="password" id="pass" name="pass" value={pass} onChange={(e)=>{setpass(e.target.value)}} placeholder="Enter your password" className=" font-mono w-[90%] px-3 py-2 bg-transparent border-[1.5px] text-white   border-slate-500 rounded-md focus:outline-none  focus:border-white/80 placeholder:font-sans" required />
                            <Link to={"/changePass"} className="hidden md:block sm:block break-before-avoid  mt-3 text-teal-300 italic text-md underline  font-bold mb-2" htmlFor="password">Change New Password?</Link>
                     </div>

                     {
                        !loading ?<button type="submit"  className="flex self-center active:scale-95  items-center justify-center rounded-full bg-slate-700 px-12 h-12 hover:font-[600] py-1 text-[15px]  font-medium w-[90%] leading-5 text-emerald-300 ">
                                    Login
                                </button>
                    :<button type="button" disabled={loading} className="flex self-center   items-center justify-center rounded-full bg-slate-600 cursor-not-allowed px-12 h-12 hover:font-[600] py-1 text-[15px]  font-medium w-[90%] leading-5 text-emerald-300 ">
                        Logging in 
                    </button>
                     }

                     
                </form>
                
            </div> 

        </div>


        <div className="transparent_blue pb-7 max-w-[450px] w-[100%] flex flex-col  px-8 pt-5  mt-2">
            <div className="w-full flex ">
                <h2 className="text-white mr-1">
                    Are You  New to explore here ?
                </h2>
             <Link to={"/register"}>   <span className=" text-teal-300 text-md   font-semibold  hover:cursor-pointer hover:underline hover:font-bold " >Chat Now!</span> </Link>
                </div>
        
                <h2 className=" text-teal-300  self-start text-md mb-3  font-semibold mt-4 hover:cursor-pointer underline hover:font-bold " >Create Account</h2>
                
            <Link to="/signup">
                <button  className="flex self-center ml-3 items-center justify-center active:scale-95  bg-transparent border-[1.5px] hover:bg-slate-100/4.5 px-12 h-12 hover:font-[600] py-1 text-[15px]  font-medium w-[90%] rounded-md  leading-5 text-emerald-300 ">
                       Sign Up
                </button>
            </Link>

            
            
        </div>

        </div>
    )
}


export default LoginPage;