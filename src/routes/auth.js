import express from "express"
import userModel from "../models/user.js";
import bcrypt from "bcrypt"
import { validateSignUpData } from "../utils/validation.js";

const authRouter= express.Router();

authRouter.post("/signup" , async(req,res)=>{
    try {
 
         // validation of data

         validateSignUpData(req)

        const {firstName , lastName , emailId , password} = req.body;

        // Encrypt the password 
        
        

        const passwordHash = await bcrypt.hash(password , 10)
        

        const user = new userModel({
            firstName,
            lastName,
            emailId,
            password : passwordHash,
        })

        

        const saveUser = await user.save();
        const token = await saveUser.getJWT();

        res.cookie("token" , token , {
            expires : new Date(Date.now() + 8 * 3600000)
        });

        res.json({
            message : "User added succesfully!" , data : saveUser
        })
        
    } catch (error) {

        res.status(400).send("Error : " + error.message)
        
    }
})


authRouter.post("/login" , async(req,res)=>{
    try {
        const {emailId , password} = req.body;
        const user = await userModel.findOne({emailId : emailId})
        
        if(!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token= await user.getJWT();
            res.cookie("token" , token , {
                httpOnly: true,  // Prevents client-side JavaScript from accessing cookies (security best practice)
                secure: process.env.NODE_ENV==="production",   // Set to true if using HTTPS
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",  // Allows cookies in cross-origin requests
                expires : new Date(Date.now() + 8 * 3600000)
            });
            res.send(user)
        }else{
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
});


authRouter.post("/logout" , async(req , res)=>{
    res.cookie("token" , null , {
        expires : new Date(Date.now()),
    })
    res.send("Logout Succesfully")
})


export default authRouter
