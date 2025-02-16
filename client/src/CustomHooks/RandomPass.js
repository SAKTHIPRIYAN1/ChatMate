const VITE_BACKURL = import.meta.env.VITE_BACKURL;
import axios from "axios";
const CreateKey = () => {
    const array = new Uint8Array(32); // 64 bits = 8 bytes
    window.crypto.getRandomValues(array); // Fill array with cryptographically secure random numbers
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const GenerateRandomPass=async ()=>{
    // trying to get pass from refershToken...
    try{
        const res=await axios.get(VITE_BACKURL+"/getRandomPass",{withCredentials:true});
        console.log(res.data);
        console.log(res.data.Auth);
        return res.data;
    }
    catch(err){
        console.log(err?.response);
        return "hhh";
    }

    
}

export default {GenerateRandomPass};