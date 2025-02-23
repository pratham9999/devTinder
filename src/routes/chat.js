import express from "express"
import userAuth from "../middleware/auth.js";
import ChatModel from "../models/chat.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:id" , userAuth, async (req , res)=>{
        
        const {id} = req.params;
        const userId = req.user._id;

        try {
            let chat = await ChatModel.findOne({
               participants : {$all : [userId , id]}
            }).populate({
                path : "messages.senderId",
                select : "firstName lastName",
            })

            if(!chat){
                chat = new ChatModel({
                    participants : [userId , id],
                    messages : [],
                }) ;

                await chat.save()
            }

            res.json(chat)
            
        } catch (error) {
            console.log(error);
            
        }
}) 





export default chatRouter