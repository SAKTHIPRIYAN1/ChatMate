import { Server } from "socket.io";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

const SuccessCode=200;
const FailureCode=500;

const userHistory = {}; // Map of userId to an array of {partnerId, timestamp}

// Duration to block pairing (e.g., 1 hour)
const BLOCK_DURATION = 60 * 60 * 1000;

function updateHistory(userId, partnerId) {
    if(userId==partnerId)
        console.log("same...")

    const now = Date.now();
    userHistory[userId] = userHistory[userId] || [];
    userHistory[userId].push({ partnerId, timestamp: now });

    userHistory[partnerId] = userHistory[partnerId] || [];
    userHistory[partnerId].push({ partnerId: userId, timestamp: now });
}

function cleanHistory(userId) {
    const BLOCK_DURATION = 10 * 60 * 1000; // 10 minutes
    const now = Date.now();

    if (!userHistory[userId]) return;

    // Filter out entries older than BLOCK_DURATION
    userHistory[userId] = userHistory[userId].filter(entry => now - entry.timestamp < BLOCK_DURATION);

    // Remove the user entirely if no valid history remains
    if (userHistory[userId].length === 0) {
        delete userHistory[userId];
    }
}

function hasPairedBefore(userId, partnerId) {
    // Ensure user history exists
    if (!userHistory[userId]) return false;

    // Check if partnerId exists in the history
    return userHistory[userId].some(entry => entry.partnerId == partnerId);
}


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
        this.maxTime=10000;
        this.io=undefined;
    }

    insert(name,interest,socketid,pass){
        console.log(pass);
        this.UserMap[socketid]=name;
        this.generalQueue.push({socketid,name,interest,time:Date.now(),pass})
        
        interest.forEach(inter => {
            if (this.interestQueues[inter]) {
                this.interestQueues[inter].push({socketid,name, interest,time:Date.now(),pass});
            } else {
                console.warn(`Interest ${interest} not recognized.`);
            }
        });

    }

    makePair(user,userList){
        cleanHistory(user.pass);  
        if(userList.length <= 0)
            return null;
        const userInterest=user.interest;
        for (let interest of userInterest){
            if(this.interestQueues[interest] && this.interestQueues[interest].length > 0 ){
                for (let currentUser of this.interestQueues[interest]){
                
                if (currentUser && !hasPairedBefore(this.readyUser.pass, currentUser.pass)){
                    this.generalQueue= this.generalQueue.filter(el=>{
                        el.socketid!=currentUser.socketid;
                    });
                    return currentUser;
                }
            }

            }
        }
        // no match.. 
        return null;
    }
    try_to_connect(socket,io) {

        if (this.generalQueue.length ==0 && this.readyUser==null){
            return;
        }

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

                console.log("Paired sss with:", pairedUser.name);
                console.log(pairedUser);
                updateHistory(this.readyUser.pass,pairedUser.pass)

                console.log(userHistory,"userhis2");
                this.sendMess(pairedUser,this.readyUser,SuccessCode);
                this.sendMess(this.readyUser,pairedUser,SuccessCode);

                this.readyUser = null;  
            } else {
                const curtime=Date.now();
                let timeInter=curtime-this.readyUser.time;
                // console.log(timeInter,this.maxTime);
                if(timeInter >=this.maxTime ){
                    // const newPairedUser=this.generalQueue.shift();
                    // console.log("random pair")
                    let mrk=null;
                    for(let newPairedUser of this.generalQueue){
                        console.log(newPairedUser);
                        console.log(hasPairedBefore(this.readyUser.pass, newPairedUser.pass))
                        if(!hasPairedBefore(this.readyUser.pass, newPairedUser.pass)){
                            updateHistory(this.readyUser.pass,newPairedUser.pass)
                            this.sendMess(newPairedUser,this.readyUser,SuccessCode);
                            this.sendMess(this.readyUser,newPairedUser,SuccessCode);
                            this.readyUser = null;
                            mrk=newPairedUser;  
                            break;
                        }
                    }
                if(mrk){
                    this.generalQueue=this.generalQueue.filter((usr)=>{
                        return usr!=mrk;
                    });
                }
                    
                }
                else{
            console.log("No pair found but still waiting......");
            const curtime=Date.now();
            let timeInter=curtime-this.readyUser.time;
            if(timeInter>15000){
                console.log("ready Usertime out SO ,, ejected...")
                this.sendMess(this.readyUser,null,FailureCode);
                this.removeFromInterestQueues(this.readyUser);
                this.readyUser=null;
            }
                setTimeout(() => this.try_to_connect(socket,io), 1000);
                }
            }
        }
        else if(this.readyUser){ 
            const curtime=Date.now();
                let timeInter=curtime-this.readyUser.time;
            if(timeInter>15000){
                this.sendMess(this.readyUser,null,FailureCode);
                this.removeFromInterestQueues(this.readyUser);
                this.readyUser=null;
                // return ;
            }
            else{
                console.log("No ppl in general Queue but still waiting.....");
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

    timeout(user){
        const timeInt=Date.now()-user.time;
                if(timeInt>15000){
                    this.sendMess(user,null,FailureCode);
                    this.removeFromInterestQueues(user);
                    return ;
                }
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
        socket.on("newRegister",({name,interest,pass})=>{
            console.log("from ",name,":",interest);

            try {
                console.log(pass);
                cls.insert(name, interest, socket.id,pass);
            } catch (error) {
                console.log("Failed to insert user:", error);
            }

            console.log("try_to_connect with a person with similiar taste.....")
            cls.try_to_connect(socket,io);
            
        });

        socket.on("changeperson",({sockid,name,interest,pass})=>{
            DisconnectAction(cls,sockid);
            // crearting new instances.......
            try {
                console.log(name, interest, socket.id);
                cls.insert(name, interest, socket.id,pass);
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