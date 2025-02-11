import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

const userAuth = async (req , res , next)=>{
    try {
        const {token} = res.cookies;
        if(!token){
            return res.status(401).send("Please Login")

        }

        const decodeObj = await jwt.verify(token , process.env.JWT_SECRET)
        const {_id} = decodeObj;
        const user = await userModel.findById(_id);
        if(!user){
            throw new Error("User not found")
        }
        
        req.user=user;
        next();
    } catch (error) {
        res.status(400).send("ERROR :" + error.message)
    }
}

export default userAuth;
