
import AnnonChatDet from "./AnnonymsConcatDet";
import {GlobeIc,UserIc,EditIC,MenuIc,ReqIcon} from "./svg";

const ConcatDescrip=({loading,setLoading})=>{
    return (
       <div className="contactContain select-none flex h-[100%] w-[35%] min-w-[400px] sm:hidden md:w-[]  ">
        <MenuBar />
        <AnnonChatDet  />
       </div>
    )
}

const MenuBar=()=>{
    let MenuArr=[
        {
        ic:MenuIc,
        des:null
        },
        {
            ic:GlobeIc,
            des:"GChat"
        },
        {
            ic:UserIc,
            des:"Private"
        },
        {
            ic:EditIC,
            des:"Edit"
        },
        {
            ic:ReqIcon,
            des:"Request"
        },


        ]
    return(
        <div className="h-[100%]      w-[90px] transition-all transparent flex flex-col gap-0"> 
                {
                    MenuArr.map((el,ind)=>{
                        return (
                                <MenuContent cont={el.ic} key={ind} des={el.des} />
                        )
                    })
                }
        </div>
    )
}

const MenuContent=(prop)=>{
    const Icon=prop.cont;
    const Des=prop.des
    return (
        <div className="w-full   py-[13px] opacity-60 hover:opacity-100 hover:cursor-pointer hover:text-teal-300  flex  justify-center">
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