import { useState,useEffect } from "react";
import { SearchBar } from "./ContactMain";
import { useLoading} from "./Loadingcontext";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Load from "./Loader";
const VITE_BACKURL = import.meta.env.VITE_BACKURL;
import toast from "react-hot-toast";
import { makeToast } from "../simpleFunctions.js";


const RequestComponent = () => {
    const { loading, setLoading } = useLoading(); 
    const Auth = useSelector((store) => store.User.Auth);
    const [data, setData] = useState({
        today: [],
        thisMonth: [],
        earlier: [],
    });

    useEffect(() => {
        async function fetchData() {
            setLoading(true); 
            try {
                const res = await axios.post(
                    `${VITE_BACKURL}/saveUser/getRequests`,
                    { Auth },
                    { withCredentials: true }
                );
                console.log("Fetched data:", res.data.data);
                setData(res.data.data); 
            } catch (err) {
                console.error("Error fetching requests:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [Auth]);;

    if (loading) {
        return <Load />;
    }

    return (
        <div className="h-full  w-full overflow-y-scroll border-x-[1px] flex flex-col pt-2 border-x-slate-950 sm:absolute sm:z-30 sm:animate-slideRight sm:bg-[#0e1118] shadow-slate-900 shadow-sm transparent_tone">
            <h1 className="sm:hidden ml-3 text-3xl font-bold">Notifications</h1>
            <div className="requests flex flex-col mt-3 w-full">
               
                {data.today.length > 0 && (
                    <div className="border-b-2 border-slate-500 mb-3 pb-3">
                        <p className="ml-2 text-slate-400 mb-1 font-bold">Today</p>
                        {data.today.map((el, key) => (
                            <Request key={key} el={el} func={setData} />
                        ))}
                    </div>
                )}

                
                {data.thisMonth.length > 0 && (
                    <div className="border-b-2 border-slate-500 mb-3 pb-3">
                        <p className="ml-2 text-slate-400 mb-1 font-bold">
                            This Month
                        </p>
                        {data.thisMonth.map((el, key) => (
                            <Request key={key} el={el} func={setData} />
                        ))}
                    </div>
                )}

                
                {data.earlier.length > 0 && (
                    <div className="border-b-2 border-slate-500 pb-3">
                        <p className="ml-2 text-slate-400 mb-1 font-bold">Earlier</p>
                        {data.earlier.map((el, key) => (
                            <Request key={key} el={el} func={setData} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const Request=({el,func})=>{
    const Auth = useSelector((store) => store.User.Auth);
    console.log(el);
    const confirmHandler=async ()=>{
        // make the api call for the confirm he request handler.....
        try{
            let res=await axios.post(VITE_BACKURL+"/request/accept",{sendAuth:el.sendAuth,acceptor:Auth});
            res = await axios.post(
                `${VITE_BACKURL}/saveUser/getRequests`,
                { Auth },
                { withCredentials: true }
            );




            func(res.data.data); 
            toast.custom((t) => (
                <div className="flex  items-center  p-2 sm:text-[15px] md:text-[18px]  backdrop-blur-lg  bg-slate-800/80 rounded-md">
                        <span className="flex items-center p-2 font-bold">        
                            Save Request Accepted:<b className=' ml-[4px] font-bold text-teal-400 '>{" "+el.sender}</b>
                        </span>
                </div>
              ), {
                position: "bottom-left", 
                duration: 1000, 
              });
        }catch(err){
          makeToast(err.response.data.msg,500)
            return;
        }

        
    }
    const declineHandler=async ()=>{
        console.log("User Request Declined from : ",el.sender);
        
        try{
            let res=await axios.post(VITE_BACKURL+"/request/decline",{sendAuth:el.sendAuth,acceptor:Auth});
            res = await axios.post(
                `${VITE_BACKURL}/saveUser/getRequests`,
                { Auth },
                { withCredentials: true }
            );

            func(res.data.data); 
            toast.custom((t) => (
                <div className="flex  items-center  p-2 sm:text-[15px] md:text-[18px]  backdrop-blur-lg  bg-slate-800/80 rounded-md">
                        <span className="flex items-center p-2 font-bold">        
                            Save request Declined:<b className=' ml-[4px] font-bold text-teal-400 '>{" "+el.sender}</b>
                        </span>
                </div>
              ), {
                position: "bottom-left", // Move toast to the bottom-left corner
                duration: 1000, // Toast will disappear after 4 seconds
              });
        }catch(err){
            makeToast(err.response.data.msg,500);
            console.log(err);
            return;
        }
    }

    return (
        <div className="request flex  justify-between px-4 h-max items-startm-0 py-2 ">
            <p className="self-center">Contact request from <span className="font-bold text-teal-400">{el.sender}</span> </p>
             {
                el.status=="pending" ?

                <>
                    {
                        Auth!=el.sendAuth?
                    <div className=" ml-1 flex gap-2 justify-between   ">
                        <button type="button" className="hover:opacity-90 hover:cursor-pointer transition-all hover:text-white flex self-center active:scale-[0.90]  items-center justify-center rounded-full bg-teal-600 px-9 h-10  py-1 text-[15px]  font-medium w-[100%] leading-5 text-slate-200" onClick={confirmHandler}>Accept</button>
                        <button className="hover:opacity-90 hover:cursor-pointer transition-all flex self-center active:scale-[0.90]  items-center justify-center rounded-full bg-slate-600  px-9 h-10 py-1 text-[15px] w-[100%] font-medium leading-5 text-teal-300" onClick={declineHandler}>Delete</button>
                    </div>
                    :

                    <div className=" ml-1 flex gap-2 justify-center self-center w-[50%]">
                <button type="button" className="hover:opacity-90 hover:cursor-pointer transition-all flex self-center  items-center justify-center rounded-full bg-slate-600 px-9 h-10  py-1 text-[15px]  font-medium w-[80%] leading-5 text-teal-300" >Requested</button>
            </div>

             }
             </>
                :
                <div className=" ml-1 flex gap-2 justify-center self-center w-[50%]">
                <button type="button" className="hover:opacity-90 hover:cursor-pointer transition-all flex self-center  items-center justify-center rounded-full bg-slate-600 px-9 h-10  py-1 text-[15px]  font-medium w-[80%] leading-5 text-teal-300" >Accepted</button>
            </div>
             }
        </div>
    )
}

export default RequestComponent;