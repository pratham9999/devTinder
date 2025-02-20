import express from "express"
import cors from "cors"
import  {connectDB}  from "./config/database.js" 
import dotenv from "dotenv"
import userModel from "./models/user.js"
import http from "http"
import cookieParser from "cookie-parser"


import authRouter from "./routes/auth.js"
import userRouter from "./routes/user.js"
import profileRouter from "./routes/profile.js"
import requestRouter from  "./routes/request.js"


dotenv.config()
const app = express();




app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("🚀 Backend is live!");
});



app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , requestRouter)
app.use("/" , userRouter)




 
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT || 7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });