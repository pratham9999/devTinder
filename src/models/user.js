import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    firstName :{
        type:String ,
        required : true,
        minLength : 4,
        maxLength : 50,

    } ,
    lastName :{
        type:String
    } ,
    emailId :{
        type:String,
        lowercase:true,
        required : true,
        unique : true,
        trim:true,
    } ,
    password :{
        type:String,
        required:true,
    } ,
    age :{
        type:Number,
        min : 18,
    } ,
    gender :{
        type:String,
        enum : {
            values : ["male" , "female" , "other"],
            message: `{Value} is not a valid gender type`
        }
    } ,

    isPremium : {
        type: Boolean,
        default : false,
    } ,
    photoUrl  :{
        type : String,
        default: "https://geographyandyou.com/images/user-profile.png",

    } ,
    about : {
        type :String,
        default  : "This is a default about og the user",
    } ,

    skills : {
        type : [String]
    } ,
}, {
    timestamps : true,
})

const userModel = mongoose.model("User" , userSchema)
export default userModel