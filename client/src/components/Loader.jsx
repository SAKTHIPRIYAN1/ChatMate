
import {HashLoader} from "react-spinners";
const Load=()=>{
return(
    <div className="fixed inset-0 grid place-items-center bg-[radial-gradient(145.05%_100%_at_50%_0%,_#1d2b41_0%,_#020509_57.38%,_#0f1a29_88.16%)] sm:scale-50 sm:bg-none">
<HashLoader
        color="#2dd4bf"
        loading
        size={95}
/>
    </div>

)
}

export const Load2=()=>{
    return(
        <div className="absolute left-0 right-0 z-50 top-0 bottom-0 grid place-content-center  sm:scale-50 sm:bg-none">
            <HashLoader
                    color="#2dd4bf"
                    loading
                    size={95}
            />
        </div>
    )
}
export default Load;