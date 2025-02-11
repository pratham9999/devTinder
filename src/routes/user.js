import express from "express" ;
import connectionRequestModel from "../models/connectionRequest.js"
import userModel from "../models/user.js";

const userRouter  = express.Router();

const USER_SAFE_DATE="fistName lastName photoUrl age gender about skills"

//Get all the pending connection request for the loggedIn user 

userRouter.get("/user/requests/received" , async (req , res)=>{
    try {
        
    } catch (error) {
        
    }
})
