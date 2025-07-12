import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"

const app = express();

app.use(cors({ origin:"http://localhost:5173/" ,credentials:true}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// importing routes
import userRouter from "./routes/user.route.js";
import BeneficiaryRouter from "./routes/beneficiaries.route.js";


app.use("/api/user",userRouter)
app.use('/api/app' , BeneficiaryRouter)
export {app}