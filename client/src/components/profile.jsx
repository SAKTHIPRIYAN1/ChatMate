import { useRef, useState } from "react";
import svg from "../assets/imag.png";
import { PencilIcon,CheckIcon } from "./svg";
const VITE_BACKURL=import.meta.env.VITE_BACKURL;
import { useDispatch, useSelector } from "react-redux";

import axios from 'axios';
import { makeToast } from "../simpleFunctions";
import { CameraIcon } from "./svg";

const ProfileComponent=()=>{

  const fileRef=useRef(null);
  // Store Contents.....
  const {name,id,email} =useSelector((store)=>store.User);

  const {profilePic}=useSelector((store)=>store.User);

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setName] = useState(name);
    const [image,setImage]=useState(VITE_BACKURL+profilePic || svg );
     
    const handleEdit = () => setIsEditing(true);
    const handleChange = (e) => setName(e.target.value);
    const hoverClass=isEditing?"border-teal-400  ":"border-slate-500" ;

    

const handleNameChange=async()=>{

        setIsEditing(false)
        if(name==newName)
            return;
        
        try{
          console.log(newName);
          const res=await axios.post(`${VITE_BACKURL}/profile/changeName`,{name:newName},{withCredentials:true});
          console.log(res.data.msg);
          makeToast(res.data.msg,200);
        }
        catch(err){
          console.log("Error Occcured:",err.response);
          makeToast("Internal Server Error.",500);
        }

    };
    
    const handlePicChange=async (e)=>{
      const file=e.target.files[0];
      if(!file){
        makeToast("No pic Selected",500);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
       makeToast("Only image files (JPG, PNG, WEBP) are allowed!",500);
        return;
    }
        
      try{
        console.log(file)
        // Create form data

        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename',file.name);

        // Send the file to the server using Axios
        const resp = await axios.post(VITE_BACKURL+"/profile/changeProfilePic", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials:true,
        });
        setImage(VITE_BACKURL+resp.data.filePath);
        console.log(image);
        console.log('File successfully uploaded:', resp.data);
      }
      catch(err){
        console.log(err);
        makeToast(err?.response?.msg || "Internal Server error",500);
      }
    }

    return(
        <div className="h-full  w-full  border-x-[1px] flex flex-col pl-4 pt-2 border-x-slate-950 sm:absolute sm:z-30 sm:animate-slideRight sm:bg-[#0e1118] shadow-slate-900 shadow-sm transparent_tone">
    <div className="flex flex-row items-center  w-full justify-start  relative">

                <h1 className="font-bold self-start text-3xl" >  <span className="text-teal-300" >Profile</span></h1>
    </div>
            <div className="flex   flex-col w-full items-center mt-5 md:px-2 px-4" >
                <div className="relative overflow-hidden  bg-gray-700 group  flex justify-center items-center h-max  rounded-full w-max">
                <img 
                  className="h-[180px] w-[180px] object-cover border-[2px] border-slate-500 rounded-full " 
                  src={image} 
                  alt="Profile Picture" 
                  draggable="false"
                />

                    <div onClick={()=>fileRef.current.click()} className="  hidden h-full w-full group bg-neutral-800/60 hover:cursor-pointer transition-all group-hover:flex flex-col items-center justify-center absolute rounded-full right-0 left-0 top-0 bottom-0">
                      <span onClick={()=>fileRef.current.click()} className=" group-hover:text-teal-300  text-slate-100  transition-all ">
                        <CameraIcon />
                      </span>
                      <h1 className="text-lg w-[70%] text-center -mb-5">
                        Modify Profile Photo
                      </h1>

                      <input type="file" accept="image/jpeg, image/jpg, image/png, image/webp" name="profilePic" id="pp" className="hidden" onChange={handlePicChange} ref={fileRef} />
                    </div>
                </div>
            </div>
    
    <div className="mt-4 flex-col">
      <h1 className="font-bold text-xl text-teal-300 mb-0 p-0">Name</h1>
      <div className={"text-lg flex justify-between pb-1  border-b-[2px] mr-5 mt-2 "+hoverClass} >
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={handleChange}
            onBlur={handleNameChange}
            autoFocus
            className="bg-transparent outline-none w-full border-none text-white"
          />
        ) : (
          <span>{newName}</span>
        )}

        <span
          className="hover:text-teal-400 active:scale-90 text-gray-200 hover:cursor-pointer"
          
        >
          {!isEditing? <div onClick={handleEdit}><PencilIcon /></div>  : <div onClick={handleNameChange}><CheckIcon /></div> }

        </span>
      </div>
    </div>
    <DetailContent heading={"Id"} value={id} />
    <DetailContent heading={"Email"} value={email} />
      

        </div>
    );
};

const DetailContent=({heading,value})=>{
 return(
  <div className="mt-5  flex-col ">
      <h1 className="font-bold text-xl  text-teal-300  mb-0 p-0">{heading}</h1>
      <h1 className="text-lg  pb-1 border-slate-500 border-b-[2px]  mr-5 mt-2">
        {value}
      </h1>        
  </div>
 )
}


export default ProfileComponent;