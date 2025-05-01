import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { PencilIcon, CheckIcon, CameraIcon, ArrowLeftIcon } from "./svg";
import svgFallback from "../assets/imag.png";
import { makeToast } from "../simpleFunctions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { alterAboutOpen,setConName } from "../Store/ContactSlice";

const ContactProfile = () => {
  const fileRef = useRef(null);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const { name, Auth, profilePic } = useSelector((store) => store.Contact);
  const userAuth = useSelector((state) => state.User.Auth);
console.log(userAuth)
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setName] = useState(name);
  const backendUrl =import.meta.env.VITE_BACKURL;
  const [image, setImage] = useState(profilePic ? backendUrl + profilePic : svgFallback);

  const id = Auth;
  const hoverClass = isEditing ? "border-teal-400" : "border-slate-500";

  useEffect(() => {
    async function fetchProfilePic() {
      try {
        const res = await axios.post(
          `${backendUrl}/profile/getPic`,
          { user_id: Auth },
          { withCredentials: true }
        );
        const { profile } = res.data;
        console.log("Fetched profile:", profile);
  
        if (profile) {
          const imgUrl = backendUrl + "/uploads/profilePic/"+ profile;
          console.log("Full image URL:", imgUrl);
          setImage(imgUrl);
        }
      } catch (err) {
        console.log("Error fetching contact profile picture:", err);
      }
    }
  
    fetchProfilePic();
  }, []);
  
  const handleEdit = () => setIsEditing(true);
  const handleChange = (e) => setName(e.target.value);

  const handleNameChange = async () => {
    setIsEditing(false);
    if (name === newName) return;

    try {
      const res = await axios.post(
        `${backendUrl}/contact/changeName`,
        { name: newName, recvAuth: Auth, userAuth },
        { withCredentials: true }
      );

      makeToast(res.data.msg, 200);
      dispatch(setConName(name));
    } catch (err) {
      console.log("Error changing contact name:", err?.response);
      makeToast("Internal Server Error.", 500);
    }
  };

  const handleClick=()=>{
    dispatch(alterAboutOpen());
  }

  const handleClickSm=()=>{
    console.log("clicked");
    navigate("/contacts");
  }


  return (
    <div  className=" hidden h-full w-full border-x-[1px] sm:flex flex-col pl-4 pt-2 border-x-slate-950 sm:absolute sm:z-30 sm:animate-slideRight sm:bg-[#0e1118] shadow-slate-900 shadow-sm transparent_tone">
      <div className="flex flex-row items-center w-full justify-start relative">
        <div onClick={handleClick} className=" sm:hidden fill-white p-2 rounded-full hover:cursor-pointer active:scale-90 transition-all hover:bg-slate-600 -ml-2 mr-4">
          <ArrowLeftIcon />
        </div>

        <div onClick={handleClickSm} className=" hidden sm:flex fill-white p-2 rounded-full hover:cursor-pointer active:scale-90 transition-all hover:bg-slate-600 -ml-2 mr-4">
          <ArrowLeftIcon />
        </div>

        <h1 className="font-bold sm:mt-1 self-start text-xl">
          <span className="text-teal-300">Contact Profile</span>
        </h1>
      </div>

      <div className="flex flex-col w-full items-center mt-5 md:px-2 px-4">
        <div className="relative overflow-hidden bg-gray-700 group flex justify-center items-center h-max rounded-full w-max">
          <img
            className="h-[180px] w-[180px] object-cover border-[2px] border-slate-500 rounded-full"
            src={image || svgFallback}
            alt="Profile Picture"
            draggable="false"
          />
        </div>
      </div>

      <div className="mt-4 flex-col">
        <h1 className="font-bold text-xl text-teal-300 mb-0 p-0">Name</h1>
        <div className={`text-lg flex justify-between pb-1 border-b-[2px] mr-5 mt-2 ${hoverClass}`}>
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
          <span className="hover:text-teal-400 active:scale-90 text-gray-200 hover:cursor-pointer">
            {!isEditing ? (
              <div onClick={handleEdit}>
                <PencilIcon />
              </div>
            ) : (
              <div onClick={handleNameChange}>
                <CheckIcon />
              </div>
            )}
          </span>
        </div>
      </div>

      <DetailContent heading={"Id"} value={id} />
    </div>
  );
};

const DetailContent = ({ heading, value }) => (
  <div className="mt-5 flex-col">
    <h1 className="font-bold text-xl text-teal-300 mb-0 p-0">{heading}</h1>
    <h1 className="text-lg pb-1 border-slate-500 border-b-[2px] mr-5 mt-2 break-words">{value}</h1>
  </div>
);

export default ContactProfile;
