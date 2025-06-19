import { useEffect, useState } from "react";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import { Routes,Route } from "react-router-dom";
import AboutMe from "./components/AboutMe";
import MessagePart from "./components/messagePage";
import PopUp from "./components/TimerRedirect";
import AnnonChatDet from "./components/AnnonymsConcatDet";
import SignUp from "./components/SignUp";
import OtpPage from "./components/OtpPage";
import ChangePassContainer from "./components/changePass";
import RequestComponent from "./components/requestComponent";
import HomeComponent from "./components/home";
import ContactComponent from "./components/ContactMain";
import ContactProfile  from "./components/contactprofile";

import { useDispatch ,useSelector} from "react-redux";
import { setUser,setUserAuth } from "./Store/AuthUser";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKURL;
import { getUserData } from "./Store/AuthUser";
import Load from "./components/Loader";

import ProfileComponent from "./components/profile";
const App=()=>{
  const dispatch = useDispatch();
  const { load } = useSelector((state) => state.User);
  const {isLoggedin}=useSelector((store)=>store.User)

// To do...
// alter api instance...
// make the preAuth even for anon Auth...
// make the contact work temporary Auth....
// create temporray User Collection to store the AnnonyMous Auth Data...

useEffect(() => {
  console.log("kk");
  dispatch(getUserData())
    .unwrap()
    .catch(() => {
      dispatch(generateAuthAsync());
    });
}, [dispatch,isLoggedin]);


  if (load) return <Load />;

  return (
   <Routes>

      <Route path="/" element={<HomeComponent />}  >
        <Route index element={<ContactComponent />} />
        <Route path="/requests" element={<RequestComponent />} />
        <Route path="contacts" element={<ContactComponent />} />
        <Route path="profile" element={<ProfileComponent />} />
      </Route>
      <Route path="/annonChatDet" element={<AnnonChatDet />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/message" element={<MessagePart />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/changePass" element={<ChangePassContainer />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/about" element={<AboutMe />} />
      <Route path="/popup" element={<PopUp />} />
      <Route path="/contact-about" element={<ContactProfile />} />
    
   </Routes>
      

  )
}

export default App;