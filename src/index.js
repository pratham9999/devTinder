import express from "express"
import cors from "cors"
import  {connectDB}  from "./config/database.js" 
import dotenv from "dotenv"
import userModel from "./models/user.js"


dotenv.config()
const app = express();




app.use(cors())
app.use(express.json())


app.post("/signup" , async (req, res)=>{

    
    const user = req.body
    
    
    const users =await  userModel.create(user)

    res.send("user added succesfully")
    
      
})

//Feed api 
app.get("/feed" , async  (req , res)=>{
         const user = await userModel.find({})
         res.json({
             user
         }) 
})
 
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });