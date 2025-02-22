
import { Server } from "socket.io";
import crypto from "crypto"

const getSecretRoomId = (userId , id)=>{

    return crypto.createHash("sha256")
    .update([userId , id].sort().join("_"))
    .digest("hex")

}
export const intializeSocket = (server)=>{
    const io = new Server(server , {
         cors : {
            origin : [
                "http://localhost:5173",
                 "https://devtinder-web-y67u.onrender.com"
            ]
         }
    })

    io.on("connection" , (socket)=>{
        
        socket.on("joinChat" , ({firstName , userId , id})=>{

            const roomId = getSecretRoomId(userId , id)
            console.log(firstName , "joiningRoom : " , roomId);
            socket.join(roomId)
            


        });
        
        socket.on("sendMessage" , ({firstName , userId , id , text})=>{

            const roomId = getSecretRoomId(userId , id)
            console.log(firstName , " " , text);
            
            io.to(roomId).emit("messageReceived" , {firstName , text} )

        })
        
        socket.on("disconnect" , ()=>{})
    })

}