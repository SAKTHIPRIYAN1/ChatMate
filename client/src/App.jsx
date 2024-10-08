import { useState } from "react";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import { Routes,Route } from "react-router-dom";
import AboutMe from "./components/AboutMe";
import MessagePart from "./components/messagePage";
import PopUp from "./components/TimerRedirect";
const App=()=>{
  return (
   <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/message" element={<MessagePart />} />
      <Route path="/about" element={<AboutMe />} />
      <Route path="/popup" element={<PopUp />} />
   </Routes>
      

  )
}

export default App;