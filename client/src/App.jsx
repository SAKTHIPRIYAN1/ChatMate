import { useState } from "react";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import { Routes,Route } from "react-router-dom";
import AboutMe from "./components/AboutMe";
import MessagePart from "./components/messagePage";
const App=()=>{
  return (
   <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/message" element={<MessagePart />} />
      <Route path="/about" element={<AboutMe />} />
   </Routes>
      

  )
}

export default App;