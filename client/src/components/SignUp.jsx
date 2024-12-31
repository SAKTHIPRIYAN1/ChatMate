
import React from "react";
import img2 from '../assets/nn.svg'
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const VITE_BACKURL = import.meta.env.VITE_BACKURL;
import { useLoading } from "./Loadingcontext";
const SignUp=()=>{
    return (
        <>
            <SignUpcontainer />
        </>
    )
};

const SignUpcontainer=()=>{
    return(
        <div className=" flex justify-between   w-[80%] sm:justify-center md:justify-center  z-0  my-auto  px-0 p-5 mx-[15%]  sm:mx-[5%]">
                    <div className="flex imgDiv h-[100%]  sm:hidden md:hidden relative min-w-[300px] ">
                        <img src={img2} alt="Load..." className="   select-none h-[700px] w-[100%] object-cover flex sm:hidden md:hidden " draggable="false" />
                    </div>
                    <div className="items-center flex mr-12 sm:mr-0 md:mr-0 sm:w-[90%] md:w-[70%] imgDiv   w-[50%] mx-2 min-w-[300px] "> 
                        <SignForm />
                    </div>
        </div>
    )
}

// onsubmiting the form...
// the email and password is sent to backend...
// the backend will send a jwt only for otp purpose (securing the email address)...
// and the user must enter the otp with the jwt from the both validate the correct otp and correct jwt for crt user...

const SignForm=()=>{
    const navigate=useNavigate();
    const {loading,setLoading}=useLoading();

     const [email,setEmail]=useState("");
     const [name,setName]=useState("");
        const [pass,setpass]=useState("");
    
        const [err,setErr]=useState("");
    
        const hangleSubmit=async (e)=>{
            e.preventDefault();
            console.log(email,pass)

            try{
                setLoading(true);
                const res=await axios.post(VITE_BACKURL+"/signUp",{name,email,password:pass},{
                    withCredentials: true,
                });
                console.log(res.data.msg);
                setLoading(false);
            navigate("/signup/otp")
                
            }
            catch(err){
                setLoading(false);
                setErr("An Error Occured...");
            }
        }


    return(

        <div className="h-[600px]   max-w-[450px] w-[100%] flex flex-col  items-center sm:pt-0 md:pt-0 pt-5">
        <div className="transparent_blue pb-7 max-w-[450px] w-[100%] flex flex-col  items-center pt-4">
            <h1 className="text-[35px] text-emberlad-300 font-bold ">CHAT<span className='text-teal-300'>MATE</span></h1>
            <div className="w-[100%] pl-8">
                <form className="" onSubmit={(e)=>hangleSubmit(e)}>
                <div className="my-6 w-full ">
                            <label className="block  text-teal-300 text-md  font-bold mb-2" htmlFor="name">UserName</label>
                            <input type="text" id="name" name="name" autoFocus={true} onChange={(e)=>{setName(e.target.value)}} placeholder="Enter your Name"   className=" w-[90%] px-3 py-2 bg-transparent border-[1.5px] text-white  border-slate-500 rounded-md focus:outline-none  focus:border-white/80" required />
                     </div>

                     <div className="my-6 w-full ">
                            <label className="block  text-teal-300 text-md  font-bold mb-2" htmlFor="name">Email</label>
                            <input type="email" id="name" name="email" autoFocus={true} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter your Email-id"   className=" w-[90%] px-3 py-2 bg-transparent border-[1.5px] text-white  border-slate-500 rounded-md focus:outline-none  focus:border-white/80" required />
                     </div>

                     <div className="my-6 w-full ">
                            <label className="block  text-teal-300 text-md  font-bold mb-2" htmlFor="password">Password</label>
                            <input type="password" id="pass" name="pass" onChange={(e)=>{setpass(e.target.value)}} placeholder="Enter your password" className=" font-mono w-[90%] px-3 py-2 bg-transparent border-[1.5px] text-white   border-slate-500 rounded-md focus:outline-none  focus:border-white/80 placeholder:font-sans" required />
                     </div>
                    {
                        !loading ? <button type="submit" disabled={loading} className="flex self-center active:scale-95   items-center justify-center rounded-full bg-slate-700 px-12 h-12 hover:font-[600] py-1 text-[15px]  font-medium w-[90%] leading-5 text-emerald-300 " >
                        Sign Up
                        </button>

                        : <button type="button" disabled={loading} className="flex self-center  items-center justify-center cursor-not-allowed rounded-full bg-slate-500 px-12 h-12 hover:font-[600] py-1 text-[15px]  font-medium w-[90%] leading-5 text-emerald-300 " >
                        Sign Up
                        </button>
                    }
                     
                </form>
                
            </div> 
            <i className="text-red-300 mt-2">{err}</i> 
        </div>


        <div className="transparent_blue pb-7 max-w-[450px] w-[100%] flex flex-col  px-8 pt-5  mt-2">
            <div className="w-full flex ">
                <h2 className="text-white mr-1">
                    Are You  Wanna Know More about Us?
                </h2>
             <Link to={"/about"}>   <span className=" text-teal-300 text-md   font-semibold  hover:cursor-pointer hover:underline hover:font-bold " >About Us!</span> </Link>
                </div>
        
                <h2 className="text-yellow-400">
                    Outh comes here
                </h2>
        </div>

        </div>
    )
}

export default SignUp;