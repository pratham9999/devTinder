import express from "express"
import userAuth from "../middleware/auth.js"
import connectionRequestModel from "../models/connectionRequest.js"
import userModel from "../models/user.js"


const requestsRouter= express.Router()

requestsRouter.post("/request/send/:status/:toUserId" , userAuth  , async(req , res)=>{
     try {

        const fromUserId=req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored" , "interested"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message : "Invalid status type : " + status
            })
        }

        const toUser = await userModel.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message : "User not found"
            })
        }

        const existingConnectionRequest = await connectionRequestModel.findOne({
            $or:[
                {fromUserId , toUserId},
                {fromUserId : toUserId , toUserId : fromUserId}
            ],
        })

        if(existingConnectionRequest){
            return res.status(400).send({message : "Connection Request Already Exists"})
        }

        const connectionRequest= new connectionRequestModel({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save()

        res.json({
            message :req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
    
        })

        
     } catch (error) {
        res.status(400).send("ERROR : " + error.message)
     }
})

requestsRouter.post("/request/review/:status/:requestId" , userAuth , async (req , res)=>{
         try {

         console.log("code caame here");
         
            const loggedInUser = req.user;
            const {status , requestId} = req.params;
            const allowedStatus = ["accepted" , "rejected"];
            if(!allowedStatus.includes(status)){
                return res.status(400).json({message : "Status not allowed!"})
            }

            const connectionRequest = await connectionRequestModel.findOne({
                _id : requestId,
                toUserId : loggedInUser._id,
                status : "interested",
            })

            if(!connectionRequest){
                return res.status(404).json({
                    message : "Connection request not found"
                })
            }

            connectionRequest.status = status;

            const data = await connectionRequest.save();
            res.json({
                message : "Connection request " + status , data
            })
            
         } catch (error) {
            res.status(400).send("ERROR : " + error.message)
         }
})

export default requestsRouter