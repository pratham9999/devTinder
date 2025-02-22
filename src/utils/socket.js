
import { Server } from "socket.io"
export const intializeSocket = (server)=>{
    const io = new Server(server , {
         cors : {
            origin : [
                "http://localhost:5173",
                 "https://devtinder-web-y67u.onrender.com"
            ]
         }
    })

    io.on("connections" , (socket)=>{
        
        socket.on("joinChat" , ()=>{

        });
        
        socket.on("sendMessage" , ()=>{

        })
        
        socket.on("disconnect" , ()=>{})
    })

}