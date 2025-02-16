
import AnnonChatDet from "./AnnonymsConcatDet";
import {GlobeIc,UserIc,EditIC,MenuIc,ReqIcon} from "./svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ConcatDescrip=({loading,setLoading})=>{

    const isVisi=useSelector((store)=>store.AnnonDes.isVisi);
    console.log(isVisi)
    return (
        <>
        <div className="contactContain select-none flex sm:hidden h-[100%] w-[35%] min-w-[400px]  ">
            <MenuBar />
            <AnnonChatDet  />
        </div>
        <div className={`contactContain select-none  hidden  h-[100%] w-full  absolute z-20 min-w-[400px] ${+isVisi?" sm:flex":''}` }>
            <MenuBar />
            <AnnonChatDet  />
        </div>
       </>
    )
};

export const MenuBar=()=>{
    let MenuArr=[
        {
        ic:MenuIc,
        des:null,
        link:"/",

        },
        {
            ic:GlobeIc,
            des:"GChat",
            link:"/register",

        },
        {
            ic:UserIc,
            des:"Contacts",
            link:"/contacts",

        },
        {
            ic:ReqIcon,
            des:"Request",
            link:"/requests",

        },

    ]

    

    return(
        <div className="h-[100%]  sm:hidden w-[85px] transition-all transparent flex flex-col gap-0"> 
                {
                    MenuArr.map((el,ind)=>{
                        return (
                                <Link to={el.link}  key={ind}>
                                   <MenuContent cont={el.ic}  des={el.des} />
                                </Link>
                        )
                    })
                }
        </div>
    )
}

export const MenuContent=(prop)=>{
    const Icon=prop.cont;
    const Des=prop.des



    return (
            <div className="w-full   py-[13px] opacity-60 hover:opacity-100 hover:cursor-pointer hover:text-teal-300  flex  justify-center" >
                <div className="flex flex-col w-full   text-center items-center">
                    <Icon />
                    <h2 className="text-[13px] mt-1 c font-sans">
                        {Des}
                    </h2>
                </div>
            </div>
    )
}

export default ConcatDescrip;