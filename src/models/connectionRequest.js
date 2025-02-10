import mongoose from "mongoose";

const connectionRequestSchema= new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true, 
    } ,

    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User" ,
        required : true,
    },

    status : {
        type: String,
        required : true,
        enum : {
            values : ["ignored" , "interested" , "accepted" , "rejected"],
            message :`{VALUE} is incorrect status type`, 
        }
    }
} , {
    timestamps : true
})


const connectionRequestModel = mongoose.model("ConnectionRequest" , connectionRequestSchema)
export default connectionRequestModel