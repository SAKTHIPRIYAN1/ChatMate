import React, { useRef, useState ,useEffect,useLayoutEffect} from "react";
import axios from "axios";
const VITE_BACKURL = import.meta.env.VITE_BACKURL;

import { useLoading } from "./Loadingcontext";

const OtpPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const {loading ,setLoading}=useLoading();

  const handleChange = (e,value, index) => {

    // Update the OTP state
    const regex = /^\d+$/; 
    // console.log(value)
    if(!regex.test(value) && value){
        // console.log("kkf")
        return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Handle Enter key to submit the form
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
        try {
            setLoading(true);
            setOtp(new Array(6).fill(""));
            let res=await axios.post(VITE_BACKURL+'/signUp/verify-otp',{otp:JSON.stringify(otp)},{
                withCredentials: true,
            });
            setLoading(false);
            console.log("verifying Otp with backend...");
            console.log(res.data);
        }
        catch(err){
          setLoading(false);
            console.log("error:",err);
        }
        
      // Add OTP submission logic here
    } else {
      console.error("Please fill all OTP fields.");
    }
  };

 

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="flex flex-col items-center justify-center border-[2px] max-w-4xl sm:min-w-sm sm:px-7 border-slate-300 px-20 py-12 rounded-md bg-transparent_tone">
        <h1 className="text-4xl bold mb-4 sm:text-xl text-teal-300">Verify Your Account</h1>
      <h2 className="text-2xl sm:text-lg mb-4 text-center">We are sending Otp to valiadte your email address,OTP has been sent to your Registered Email,Hang On!</h2>
      <h1 className="text-2xl sm:text-lg font-bold mb-4 ">Enter OTP</h1>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-4"
        autoComplete="off"
      >
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={value}
            onChange={(e) => handleChange(e,e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-12 h-12 sm:h-10 sm:w-10 text-center bg-slate-800 text-lg font-bold border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        ))}
      </form>
      <div className="flex mt-4 gap-10">
        <ResendOtpButton />

        {
          !loading ?<button
          onClick={handleSubmit}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          
      >
          Submit OTP
      </button>
      :
      <button

            className="px-4 py-2 bg-teal-500 opacity-80 text-white cursor-not-allowed rounded hover:bg-teal-600"  
        >
            Submit OTP
        </button>
        }
      </div>
      </div>
    </div>
  );
};


const ResendOtpButton = () => {
    const [timeLeft, setTimeLeft] = useState(20); // Timer starts at 20 seconds
    const [isDisabled, setIsDisabled] = useState(true);

    const resendOtp=async (e)=>{
        setTimeLeft(20); // Reset timer to 20 seconds
        setIsDisabled(true);
        e.preventDefault();
            try {
                let res=await axios.get(VITE_BACKURL+'/signUp/resend-otp',{withCredentials:true});
                console.log("resend  Otp with backend...");
                console.log(res.data);
            }
            catch(err){
                console.log("error:",err);
            }
      }
   

    useEffect(() => {
        let timer;
        if (isDisabled && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsDisabled(false);
            clearInterval(timer);
        }
        return () => clearInterval(timer); // Cleanup on unmount
    }, [isDisabled, timeLeft]);

    return (
        <button
            onClick={resendOtp}
            disabled={isDisabled}
            className={`px-4 py-2 rounded text-white ${
                isDisabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-slate-600 hover:bg-slate-700"
            }`}
        >
            {isDisabled ? <span>Resend OTP in <span className="text-teal-300">{timeLeft}s </span> </span> : "Resend OTP"}
        </button>
    );
};



export default OtpPage;