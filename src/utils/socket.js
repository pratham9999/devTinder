
import { Server } from "socket.io";
import crypto from "crypto"
import ChatModel from "../models/chat.js";

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
        
        socket.on("sendMessage" , async ({firstName , userId , id , text})=>{


            try {
                const roomId = getSecretRoomId(userId , id)
                console.log(firstName , " " , text);

             // save the message to database

            let chat = await ChatModel.findOne({
                  participants : {$all : [userId , id]} ,
            }) ;

            if(!chat){
                chat = new ChatModel({
                    participants : [userId , id],
                    messages : []
                })
            }

            chat.messages.push({
                senderId : userId,
                text,
            })

            await chat.save();



                io.to(roomId).emit("messageReceived" , {firstName , text} )

                
            } catch (error) {
                console.log(error);
                
                
            }
            

        })
        
        socket.on("disconnect" , ()=>{})
    })

}