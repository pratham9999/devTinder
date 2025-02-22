import express from "express" ;
import connectionRequestModel from "../models/connectionRequest.js"
import userModel from "../models/user.js";
import userAuth from "../middleware/auth.js"

const userRouter  = express.Router();

const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills"

//Get all the pending connection request for the loggedIn user 

userRouter.get("/user/requests/received" , userAuth, async (req , res)=>{
    try {

        const loggedInUser=req.user;
        const connectionRequests= await connectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested",
        }).populate("fromUserId" , USER_SAFE_DATA);

        res.json({
            message: "Data fetched successfully",
            data : connectionRequests
        })
        
    } catch (error) {

        res.status(400).send("ERROR: " + error.message)
        
    }
})

userRouter.get("/user/connections" , userAuth , async(req , res)=>{
    try {

        const loggedInUser= req.user;
        const connectionRequests = await connectionRequestModel.find({
            $or:[
                {toUserId : loggedInUser._id , status : "accepted"},
                {fromUserId : loggedInUser._id , status:"accepted"}
            ]
        })
        .populate("fromUserId" , USER_SAFE_DATA)
        .populate("toUserId" , USER_SAFE_DATA)
        
        

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }

            return row.fromUserId;
        })

        res.json({
            data
        })
        
    } catch (error) {
         res.status(400).send({
            message : error.message
         })
    }
})


userRouter.get("/feed" , userAuth , async(req,res)=>{

    try {

        const loggedInUser = req.user;
        const page = parseInt(req.query.page)||1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;

        const connectionRequests= await connectionRequestModel.find({
            $or : [{fromUserId : loggedInUser._id} , {toUserId : loggedInUser._id}],
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        });

        const users = await userModel.find({
            $and: [
              { _id: { $nin: Array.from(hideUsersFromFeed) } },
              { _id: { $ne: loggedInUser._id } },
            ],
          })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);
      
          res.json({ data: users });
      
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
        
    }

})


export default userRouter