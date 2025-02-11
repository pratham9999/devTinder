import express from "express";
import userAuth from "../middleware/auth.js"

const profileRouter = express.Router();

profileRouter.get("/profile/view" , userAuth , async(req , res)=>{
    try {

        const user = req.user;
        res.send(user)
        
    } catch (error) {
        console.log(error);
        res.status(400).send("Error :"+ error.message)
        
    }
})

profileRouter.patch("/profile/edit" , userAuth , async(req , res)=>{
    try {

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfuly`,
            data: loggedInUser,
          });
      

        
    } catch (error) {
        res.status(400).send("ERROR: "  + error.message )
    }
})

export default profileRouter;