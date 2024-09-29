import { Server } from "socket.io";

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
        this.UserMap={}
        this.readyUser=null;
        this.connected=false;
        this.maxTime=20000;
        this.io=undefined;
    }

    insert(name,interest,socketid){
        this.UserMap[name]=socketid;
        this.generalQueue.push({name,interest,time:Date.now() })
        
        interest.forEach(inter => {
            if (this.interestQueues[inter]) {
                this.interestQueues[inter].push({ name, inter,time:Date.now() });
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
                    el.name!=currentUser.name;
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
                    this.interestQueues[interest] = this.interestQueues[interest].filter(u => u.name !== user.name);
                }
            });
        }
    }
    
    sendMess(recip,UserInfo,code){
        console.log("sent...")
        const RecipScoketId=this.UserMap[recip.name];
        this.io.to(RecipScoketId).emit("ack", {code,UserInfo});
        this.removeFromInterestQueues(recip)

    }
    
}
const disconnect=()=>{
    console.log("The user is disconnected....")
}

const Anonymousmessage=({reciv,mgs})=>{
    console.log("to"+reciv+":"+mgs);
}



const socketSetup=(AppServer)=>{
    const io=new Server(AppServer,{
        cors:process.env.URL,
        methods:["GET","POST"],
    })

    let cls=new AnonymousChatting()

    io.on("connection",(socket)=>{
        cls.io=io;
        console.log("a user connected");
        socket.on("newRegister",({name,interest})=>{
            console.log("from ",name,":",interest);
            cls.insert(name,interest,socket.id)
            // console.log(cls)

            console.log("try_to_connect with a person with similiar taste.....")
            cls.try_to_connect(socket,io);
            
        });

        

        socket.on("AnnonymousMess",({reciv,mgs})=>Anonymousmessage());
        socket.on('disconnect', disconnect);
    })

}

export default socketSetup;