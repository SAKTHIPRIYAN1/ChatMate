
import { ClearAnnonRecip } from "../Store/AnonymousUser";
import { clearAnnonMess } from "../Store/AnnonymousMessages";

const useRegRedirect=({dispatch,socket,sockid})=>{

    // socket connection to disconnect and to connect......
    // clearing the valus in the store...

    dispatch(clearAnnonMess());
    dispatch(ClearAnnonRecip());
        
        if(socket){
            socket.emit("ReUser",{sockid});
        }
}

export default useRegRedirect;

