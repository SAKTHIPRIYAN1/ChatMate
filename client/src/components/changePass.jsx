

import React, { useState,useEffect } from "react";
import img2 from '../assets/pass3.png'
import axios from "axios";
import toast from "react-hot-toast";

import { PreAuth } from "../simpleFunctions";

const VITE_BACKURL = import.meta.env.VITE_BACKURL;
import { useLoading } from "./Loadingcontext";

import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
const ChangePassContainer=()=>{
    const location = useLocation();
    const isConfirmPass = location.state?.isConfirmPass || false;
    return(
            <div className=" flex  justify-center items-center h-[100vh] w-full min-w-[300px] "> 
                  {
                    !isConfirmPass ? <ChangePassword />:<ActualChangeContainer />
                  }
            </div>
        )
}

const ChangePassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const {loading,setLoading}=useLoading();

    const navigate =useNavigate();



    const handleSendOtp = async () => {
        console.log(email);
        setLoading(true);
        if (!email) {
            setLoading(false);
            toast.error("Please enter your email address.", {
                duration: 3000,
                position: 'top-right',
                
                  style: {
                  color: '#fff',
                  backgroundColor:'rgba(39, 50, 73, 0.934)',
                  },
                });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error("Please enter Vaild email address.", {
                duration: 3000,
                position: 'top-right',
                
                  style: {
                  color: '#fff',
                  backgroundColor:'rgba(39, 50, 73, 0.934)',
                  },
                });
                setLoading(false)
                return;
        }
        
        try{
           
            const res=await axios.post(VITE_BACKURL+"/changePassword",{email},{
                withCredentials:true
            });
            setLoading(false)
            console.log(res.data.msg);

            toast.success(res.data.msg, {
                duration: 3000,
                position: 'top-right',
                
                  style: {
                  color: '#fff',
                  backgroundColor:'rgba(39, 50, 73, 0.934)',
                  },
                });
            navigate("/otp");
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
    };

    return (
        <div className=" pb-7 max-w-[600px] border-[2px] rounded-md border-slate-300   w-[100%] flex flex-col min-h-[450px] justify-center  items-center pt-4 relative">
             <img src={img2} alt="Load..." className=" blur-sm max-w-[500px] opacity-25 select-none object-cover flex absolute " draggable="false" />
            <div className=" p-6 rounded  shadow-md w-[70%] z-[10]">
                <h1 className="text-3xl font-semibold text-teal-300 mb-4">Change Password</h1>

                <p className="text-lg italic text-yellow-500 mb-4">
                    Please enter your email address to receive a One-Time Password (OTP) for resetting your password.
                </p>

                <label className="block text-xl text-teal-300 text-md  font-bold mb-2" htmlFor="name">Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border bg-slate-600 outline-teal-600 border-gray-300 rounded mb-4"
                />
           {
            !loading ?  <button
            onClick={handleSendOtp}
            className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
            >
                Send OTP
            </button>
            :
            <button
                disabled={loading}
                className="w-full bg-teal-600 opacity-85 cursor-not-allowed text-white p-2 rounded "
            >
                  Sending OTP...
            </button>
           }
            </div> 
        </div>
    );
};


const ActualChangeContainer=()=>{
    const [pass1,setPass1]=useState("");
    const [pass2,setPass2]=useState("");
    const navigate=useNavigate();


    useLayoutEffect(() => {
        const stat = async () => {
          try {
            const status = await PreAuth("pass");
            console.log(status);
            if (status !== 200) {
            console.log(status);
              navigate("/login");
            }
          } catch (error) {
            console.error("Error during pre-authentication:", error);
            navigate("/login"); 
          }
        };
        stat();
    });

    
    const handleSubmit= async (e)=>{
        setLoading(true);
        if (pass1!==pass2) {
            setLoading(false);
            toast.error("Please Enter the same Password.", {
                duration: 3000,
                position: 'top-right',
                
                  style: {
                  color: '#fff',
                  backgroundColor:'rgba(39, 50, 73, 0.934)',
                  },
                });
            return;
        }

        if (pass1.length<6) {
            setLoading(false);
            toast.error("Password must atleast consists of 6 characters.", {
                duration: 3000,
                position: 'top-right',
                
                  style: {
                  color: '#fff',
                  backgroundColor:'rgba(39, 50, 73, 0.934)',
                  },
                });
            return;
        }


        
        try{
           
            const res=await axios.post(VITE_BACKURL+"/confirmPassword",{password:pass1},{
                withCredentials:true
            });
            setLoading(false)
            console.log(res.data.msg);

            toast.success(res.data.msg, {
                duration: 3000,
                position: 'top-right',
                
                  style: {
                  color: '#fff',
                  backgroundColor:'rgba(39, 50, 73, 0.934)',
                  },
                });
            navigate("/login");
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

    const {loading,setLoading}=useLoading();
    
    return (
        <div className=" pb-7 max-w-[600px] border-[2px] rounded-md border-slate-300   w-[100%] flex flex-col min-h-[450px] justify-center  items-center pt-4 relative">
             <img src={img2} alt="Load..." className=" blur-sm max-w-[500px] opacity-25 select-none object-cover flex absolute " draggable="false" />
            <div className=" p-6 rounded  shadow-md w-[70%] z-[10]">
                <h1 className="text-3xl font-semibold  mb-4">Change Password</h1>

                
                <label className="block text-xl text-teal-300 text-md  font-bold mb-2" htmlFor="name">New Password</label>
                <input
                    type="password"
                    placeholder="Enter the new Password"
                    onChange={(e) => setPass1(e.target.value)}
                    className="w-full p-2 border bg-slate-600 outline-teal-600 border-gray-300 rounded mb-4"
                />

                <label className="block text-xl text-teal-300 text-md  font-bold mb-2" htmlFor="name">Confirm  Password</label>
                <input
                    type="password"
                    placeholder="confirm your Password"
                    onChange={(e) => setPass2(e.target.value)}
                    className="w-full p-2 border bg-slate-600 outline-teal-600 border-gray-300 rounded mb-4"
                />
           {
            !loading ?  <button
            onClick={handleSubmit}
            className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
            >
                 Submit
            </button>
            :
            <button
                disabled={loading}
                className="w-full bg-teal-600 opacity-85 cursor-not-allowed text-white p-2 rounded "
            >
                  Submitting...
            </button>
           }
            </div> 
        </div>
    );
}

export default ChangePassContainer;
