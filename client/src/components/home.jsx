import { useState,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import ContactComponent from "./ContactMain";

import { MenuBar } from "./contactDescrip";
import RequestComponent from "./requestComponent";
import { useLocation } from "react-router-dom";
import RandomPass from "../CustomHooks/RandomPass";
import { setUserAuth,setUser } from "../Store/AuthUser";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKURL;
import MainMessageContain from "./MainMessage";
const HomeComponent=()=>{

    return( 
        <div className="h-[100vh]   w-[100vw] fixed right-0 left-0 top-0  gap-0 border-none  bg  p-0 flex">
            <MainContent />
            <MainMessageContain />
        </div>
    );
}

const MainContent=()=>{
    return(
        <>
            <div className="contactContain select-none flex sm:hidden h-[100%] w-[35%] min-w-[400px] ">
                <MenuBar />
                <Outlet />
            </div>
        </>
    )
}

export default HomeComponent