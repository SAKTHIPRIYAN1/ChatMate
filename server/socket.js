import { Server } from "socket.io";


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
    }

    insert(name,interest,socketid){
        this.UserMap[name]=socketid;
        this.generalQueue.push({name,interest})

        interest.forEach(inter => {
            if (this.interestQueues[inter]) {
                this.interestQueues[inter].push({ name, inter });
            } else {
                console.warn(`Interest ${interest} not recognized.`);
            }
        });

    }

    makePair(user){
        const userInterest=user.interest;
        // console.log(userInterest);
        for (let interest of userInterest){
            if(this.interestQueues[interest] && this.interestQueues[interest].length > 0 ){
                const currentUser=this.interestQueues[interest].shift()

                this.generalQueue.filter(el=>{
                    el!=currentUser;
                })

                return currentUser;
            }
        }
        // no match..
        return null;
    }
    try_to_connect(){
        // console.log("trying....")
        while(this.generalQueue.length>0){

            // take the first user...
            if(this.readyUser==null){
                this.readyUser=this.generalQueue.shift();
                continue;
            }
            // take the user and match with the other user...
            const pairedUser=this.makePair(this.readyUser);
            if(pairedUser==null){
                pairedUser=this.generalQueue.shift();
            }
            // console.log(this.readyUser,'is paired with',pairedUser);
            this.readyUser=null;

        }
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
        console.log("a user connected");
        socket.on("newRegister",({name,interest})=>{
            console.log("from ",name,":",interest);
            cls.insert(name,interest,socket.id)
            console.log(cls)

            console.log("try_to_connect with a person with similiar taste.....")

            cls.try_to_connect();
        });

        socket.on("AnnonymousMess",({reciv,mgs})=>Anonymousmessage());
        socket.on('disconnect', disconnect);
    })

}

export default socketSetup;