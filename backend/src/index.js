import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})
const port = process.env.PORT || 8000
connectDB()
.then(()=>{
    app.on("error",(err)=>{
        console.log("Error: " , err);
        throw err
        
    })
    app.listen(port , ()=>{
        console.log("server is running on a port " , port);
        
    })
})
.catch((error)=> { 
    console.log("DB Connection Failed !! ", error)}
)

//  ***Remaining to Implement***
// cron job
// rate lime
// helmet
// mongo sanitize for injection attacks
// Time to live
// bullMQ for assigning time taken task to my worker
// redis cache
// Dockers
// AWS (EC2) deployment
//  ***Remaining to learn***
// payment integration
// CICD pipeline 
// sockets
// PM2