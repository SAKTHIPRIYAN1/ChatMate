import { Server } from "socket.io";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

const SuccessCode=200;
const FailureCode=500;

class AnonymousChatting{
    constructor(){
        this.generalQueue=[],
        this.interestQueues = {
            Funny: [],
            Technical: [],
            Sarcasm: []
        },
        this.UserMap={};
        this.SenderReciverMap={};
        this.readyUser=null;
        this.connected=false;
        this.maxTime=20000;
        this.io=undefined;
    }

    insert(name,interest,socketid){
        this.UserMap[socketid]=name;
        this.generalQueue.push({socketid,name,interest,time:Date.now() })
        
        interest.forEach(inter => {
            if (this.interestQueues[inter]) {
                this.interestQueues[inter].push({socketid,name, interest,time:Date.now() });
            } else {
                console.warn(`Interest ${interest} not recognized.`);
            }
        });

    }

    makePair(user,userList){
        if(userList.length <= 0)
            return null;
        const userInterest=user.interest;
        for (let interest of userInterest){
            if(this.interestQueues[interest] && this.interestQueues[interest].length > 0 ){
                const currentUser=this.interestQueues[interest].shift()
               this.generalQueue= this.generalQueue.filter(el=>{
                    el.socketid!=currentUser.socketid;
                })
                return currentUser;
            }
        }
        // no match..
        return null;
    }
    try_to_connect(socket,io) {
        
        if (this.generalQueue.length > 0) {
            if (!this.readyUser) {
                // Assign first user in the queue to readyUser
                this.readyUser = this.generalQueue.shift();
                // remove from the other queue...
                this.removeFromInterestQueues(this.readyUser);
                console.log("Ready user:", this.readyUser.name);
            }

            // Try to pair with another user
            const pairedUser = this.makePair(this.readyUser, this.generalQueue);

            if (pairedUser) {
                console.log("Paired with:", pairedUser.name);
                this.sendMess(pairedUser,this.readyUser,SuccessCode);
                this.sendMess(this.readyUser,pairedUser,SuccessCode);

                this.readyUser = null;  
            } else {
                const curtime=Date.now();
                let timeInter=curtime-this.readyUser.time;
                if(timeInter >=this.maxTime ){
                    const newPairedUser=this.generalQueue.shift();
                    console.log("random pair")
                    this.sendMess(newPairedUser,this.readyUser,SuccessCode);
                    this.sendMess(this.readyUser,newPairedUser,SuccessCode);
                    this.readyUser = null;  
                }
                else{
                console.log("Waiting for a match...");
                setTimeout(() => this.try_to_connect(socket,io), 1000);
                }
            }
        }
        else if(this.readyUser){
                const timeInt=Date.now()-this.readyUser.time;
                if(timeInt>15000){
                    this.sendMess(this.readyUser,null,FailureCode);
                    this.removeFromInterestQueues(this.readyUser);
                    this.readyUser=null;
                    return ;
                }
                else{
                    console.log("Waiting for a match...");
                    setTimeout(() => this.try_to_connect(socket,io), 1000);
                    }
        }
    }

    removeFromInterestQueues(user) {
        const userInterests = user.interest;
        if(userInterests){
            userInterests.forEach((interest) => {
                if (this.interestQueues[interest]) {
                    this.interestQueues[interest] = this.interestQueues[interest].filter(u => u.socketid !== user.socketid);
                }
            });
        }
    }
    
    sendMess(sender,UserInfo,code){
        console.log("sent...")
        if(UserInfo){
            this.SenderReciverMap[sender.socketid]=UserInfo.socketid;
            console.log(this.SenderReciverMap);
        }
        const RecipScoketId=sender.socketid;
        this.io.to(RecipScoketId).emit("ack", {code,UserInfo,socketid:sender.socketid});
        this.removeFromInterestQueues(sender)
    }

    NotifyReceiver(socketid){
        if(this.SenderReciverMap[socketid]){
            const RecivId=this.SenderReciverMap[socketid];


            delete this.UserMap[socketid];
            delete this.SenderReciverMap[socketid];
            delete this.SenderReciverMap[RecivId];
            delete this.UserMap[RecivId]; 

            // emit message to receiver..
            console.log("emiiting disconnected2 Message...");
            const Code=500;
            this.io.to(RecivId).emit("senderDisconnected",Code);

        }
    }

    transmitMessage(ReceiverSock,message){
        console.log("transmitting Message....");
        this.io.to(ReceiverSock).emit("ReceiveMessage",message);
        console.log("transmitted...")
    }


}


const DisconnectAction=(cls,socketid)=>{
    if (cls.UserMap[socketid]) { 
        delete cls.UserMap[socketid];  
        console.log(`User  ${socketid}  removed`);
    }

    try{
        cls.NotifyReceiver(socketid);
        console.log("successfully notified....")
    }
    catch(err){
        console.log("notification error",err)
    }
}



const socketSetup=(AppServer)=>{
    const io=new Server(AppServer,{
        cors:process.env.URL,
        methods:["GET","POST"],
    })

    let cls=new AnonymousChatting();

    io.on("connection",(socket)=>{
        cls.io=io;
        console.log("a user connected");
        socket.on("newRegister",({name,interest})=>{
            console.log("from ",name,":",interest);

            try {
                cls.insert(name, interest, socket.id);
            } catch (error) {
                console.log("Failed to insert user:", error);
            }

            console.log("try_to_connect with a person with similiar taste.....")
            cls.try_to_connect(socket,io);
            
        });

        socket.on("changeperson",({sockid,name,interest})=>{
            DisconnectAction(cls,sockid);
            // crearting new instances.......
            try {
                console.log(name, interest, socket.id);
                cls.insert(name, interest, socket.id);
            } catch (error) {
                console.log("Failed to insert user:", error);
            }

            console.log("try_to_connect with a person with similiar taste.....")
            cls.try_to_connect(socket,io);
        });

        socket.on("sendMess",({message,ReceiverSock})=>{
            console.log(message," has sent to ",ReceiverSock,"form",socket.id);
            try{
              cls.transmitMessage(ReceiverSock,message);
            }
            catch(err){
                console.log("transmitting ERror",err);
            }
            
            
        });

        socket.on('ReUser',({sockid})=>{
            console.log('redirection req...')
            DisconnectAction(cls,sockid);
        });


        socket.on('sendFile', ({filePath,name,receiverId}) => {
                console.log(name,' sent from sender to server:', filePath);
                io.to(receiverId).emit('receiveFile',{filePath,name});
        });


        socket.on('disconnect',()=>{
            DisconnectAction(cls,socket.id);
        });
    });

}

export default socketSetup;