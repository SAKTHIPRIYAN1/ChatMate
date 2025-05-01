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
import { Link } from "react-router-dom";
import MainMessageContain from "./MainMessage";
import LoginRemainder from "./LoginRemainder";

import { SearchBar } from "./ContactMain";
const HomeComponent=()=>{

    return( 
        <div className="h-[100vh]   w-[100vw] fixed right-0 left-0 top-0  gap-0 border-none  bg  p-0 flex">
            <MainContent />
            <MainMessageContain />
        </div>
    );
}

const MainContent=()=>{
    let options = [
        { name: "Contacts", link: "/contacts" },
        { name: "GChat", link: "/register" },
        { name: "Requests", link: "/requests" },
    ];

    const { isContactOpen } = useSelector((store) => store.User);
    const location = useLocation(); // Get the current route
    const [selectedLink, setSelectedLink] = useState(location.pathname); // Default to current route

    useEffect(() => {
        // Update selected link when the route changes
        setSelectedLink(location.pathname);
    }, [location]);

    const handleLinkClick = (link) => {
        setSelectedLink(link);
    };

    return(
        <>
            <div className="contactContain select-none flex sm:hidden h-[100%] w-[35%] min-w-[400px] " >
                <MenuBar />
                <Outlet />
            </div>

        {
           isContactOpen ||
                <div className={" "+isContactOpen==true?"sm:hidden":"sm:flex hfsdh sm:flex-col hidden contactContain m-0 sm:w-full mr-4  h-full pt-2 pr-2 pb-0 sm:justify-center select-none min-w-[400px] "}>
            
            
            <SearchBar />
                <div className={"w-[90%]  ml-4 mt-2 flex flex-row  pb-0 mb-0   justify-between items-center"}>
                {options.map((option, index) => (
                        <Link
                            key={index}
                            to={option.link}
                            onClick={() => handleLinkClick(option.link)}
                            className={`option-item block p-2 ${
                                selectedLink === option.link
                                    ? "text-teal-300 underline"
                                    : "text-gray-500"
                            } hover:text-teal-400`}
                        >
                            {option.name}
                        </Link>
                    ))}
                </div>
                
                <div className="h-full w-full">
                <Outlet />
                </div>
            </div>
            
        }
        </>
    )
}

export default HomeComponent