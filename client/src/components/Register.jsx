import { useEffect, useState,useRef } from "react";
import img2 from '../assets/l.svg'
import { Link} from "react-router-dom";
import { useNavigate} from "react-router-dom";


import Load from "./Loader";
import { LoadingProvider, useLoading } from "./Loadingcontext";

// redux....
import {useDispatch,useSelector} from 'react-redux'
import { alter,setUserSock,setUserName} from "../Store/RegisterUser";

// Annonymous chat redux....
import { setAnnonymousPair } from "../Store/AnonymousUser";


// socket..
import { useSocket } from "../SocketContext";


// RandomPass For auth....
import RandomPass from "../CustomHooks/RandomPass";
import toast from "react-hot-toast";
import store from "../Store/store";

const apiUrl = import.meta.env.VITE_BACKURL



const RegisterPage=()=>{
    return(
        <LoadingProvider>
            <div className=" fullas transition-all  flex justify-center">
                <RegisterContainer />  
            </div>
        </LoadingProvider>
        
    )
}

const RegisterContainer=()=>{
    return (
        <div className=" flex justify-center  sm:w-auto  md:items-center  w-auto sm:justify-center md:justify-center md:w-[80%]  z-0  my-auto  px-0 p-5 md:mx-auto sm:mx-auto">
            <div className="flex imgDiv h-[100%]  sm:hidden md:hidden relative min-w-[300px] ">
                <img src={img2} alt="Loading..." className="   select-none h-[700px] w-[100%] object-cover flex sm:hidden md:hidden " draggable="false" />
            </div>
            <div className=" flex items-center sm:mr-0 md:mr-0 sm:w-[100%] md:w-[90%]  justify-center  mr-12 imgDiv w-[50%] my-auto min-w-[300px] "> 
            <RegisterPart />
            </div>
        </div>
    )
}



const RegisterPart=()=>{

    // ref.....
    const typerRef=useRef(null);

    const navigate=useNavigate();
    

    const dispatch=useDispatch();

    const {loading,setLoading}=useLoading();

    // interest from the store....
    const [activePreferences,setactive]=useState(new Set(useSelector((store)=>store.UserReg.interest)));
    const [name,setName]=useState(useSelector((store)=>store.UserReg.name));
    const RandomPassKey = useSelector((store)=>store.User.AnnonPass);
    
    // console.log(name);
    // let activePreferences=new Set(useSelector((store)=>store.UserReg.interest))

    // scoket connection...
    const {socket}=useSocket();

    useEffect(() => {
        if (socket!==null) {
            

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            socket.on("connect_error", (error) => {
                console.log("Socket connection error:");
            });
        }
    }, [socket]);

    useEffect(()=>{
    const handleAck = ({ code, UserInfo,socketid }) => {
            if (CheckResponse(code)) {
                const msg = UserInfo.name;
                console.log(code + "kkkk");
                console.log("stop load..", UserInfo);
                dispatch(setAnnonymousPair(UserInfo));
                console.log(socketid);
                dispatch(setUserSock(socketid));
                setLoading(false);
                navigate("/message",{state:{isAnnon:true}});
            } else {
                setLoading(false);
                toast.error("No Pair Found", {
                    duration: 3000,
                    position: 'bottom-left',
                    
                      style: {
                      color: '#fff',
                      backgroundColor:'rgba(39, 50, 73, 0.934)',
                      },
                    });
            }
    };




    if(socket!=null){
        socket.on("ack",handleAck);
    }
    return ()=>{
        if(socket){
            socket.off("ack",handleAck);
        }
    }
    },[socket])

    // store alter....
    const handleClick = (preference) => {
        const newSet=activePreferences;
            if (newSet.has(preference)) {
                newSet.delete(preference);
            } else {
                newSet.add(preference);
            }
            dispatch(alter([...newSet]))
    };

    const CheckResponse=(code)=>{
        console.log(code);
        return code==200;
    }
   const UserId=useSelector((store)=>store.User.id);
// connect to the socket....
    const handleSubmit = async (e) => {

        // connecting with the pair after clickung the submit
        socket.on("connect", () => {
            console.log("Socket connected");
        });

       
       console.log(RandomPassKey)
        e.preventDefault();
        
        try {
            setLoading(true);
            let tmp=[...activePreferences];
            tmp=tmp.sort();
            console.log(RandomPassKey,"client....");
            socket.emit('newRegister', {name,interest:tmp,pass:RandomPassKey,UserId});
            console.log("sent...");

        } catch (error) {
            setLoading(false)
            console.log("Error fetching data:", error);
            setErr(error);
        }
       
        
        dispatch(setUserName(name));
    }

  
    if(loading)
        return(<Load/>)

    return(
        
        <div className="h-[600px]  max-w-[450px] w-[100%] flex flex-col  items-center  justify-center  ">
        <div className="transparent_blue pb-7 max-w-[450px] w-[100%] flex flex-col  items-center pt-8">
            <h1 className="text-[35px] text-slate-200 font-bold ">CHAT<span className='text-teal-300'>MATE</span></h1>
            <div className="w-[100%] pl-8">
                <form className="" onSubmit={(e)=>handleSubmit(e)}>
                     <div className="my-6 w-full ">
                            <label className="block  text-teal-300 text-md  font-bold mb-2" htmlFor="name">How Can we Call U?</label>
                            <input type="text" id="name" ame="name" ref={typerRef} autoFocus={true} onChange={(e)=>{setName(e.target.value)}} value={name} placeholder="Enter your userid" className=" w-[90%] px-3 py-2 bg-transparent border-[1.5px] text-white  border-slate-500 rounded-md focus:outline-none  focus:border-white/80" required />
                     </div>

                     <div className="flex mt-2 mb-4">
                        <h2 className="text-white mr-1">
                            Already having Account ?
                        </h2>
                        <Link to={"/login"}>   <span className=" text-teal-300 text-md   font-semibold  hover:cursor-pointer hover:underline hover:font-bold " >Login</span> </Link>
                    </div>
                     <button type="submit" className="flex self-center active:scale-95  items-center justify-center rounded-full bg-slate-700 px-12 h-12 hover:font-[600] py-1 text-[15px]  font-medium w-[90%] leading-5 text-emerald-300 ">
                          ChatNow   
                     </button>
                </form>
                
            </div> 
            
        </div>


        <div className="transparent_blue pb-7 max-w-[450px] w-[100%] flex flex-col  px-8 pt-5  mt-2">
        <h1 className="block  text-teal-300 text-md  font-bold mb-3">Interests</h1>
            <PreferenceButtons handleClick={handleClick} activePreferences={activePreferences}/>
        </div>

        </div>

    
    )
}

const PreferenceButtons = ({handleClick,activePreferences}) => {
  
    return (
        <div className="flex p-4 py-5 bg-slate-600/70 w-[100%] sm:flex-col sm:items-center   rounded-lg shadow-md justify-between">
            
            {['Funny', 'Technical', 'Sarcasm'].map(preference => (
                <button
                    key={preference}
                    className={`px-4 py-2 rounded-lg border active:scale-95 sm:mt-3 border-gray-300  sm:w-[50%] cursor-pointer transition-colors duration-300 ease-in-out ${
                        activePreferences.has(preference) ? 'bg-teal-500 text-white ' : 'bg-white text-gray-700'
                    }`}
                    onClick={() => handleClick(preference)}
                >
                    {preference}
                </button>
            ))}
        </div>
    );
}

export default RegisterPage;