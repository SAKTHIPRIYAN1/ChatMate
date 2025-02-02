import { getIo } from "../socket.js";


const notifyUser=(sockId,mess)=>{
    const io=getIo();
    io.to(sockId).emit("notification",mess);
    console.log("notification sent");
}

const SaveRequestNotification=(sockId,sender,sendAuth)=>{
    const io=getIo();
    io.to(sockId).emit("saveReq",{sender,sendAuth});
    console.log("notification sent");
}


export default SaveRequestNotification;
