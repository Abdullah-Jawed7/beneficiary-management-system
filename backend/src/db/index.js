import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async ()=>{
    try {
       let connectionInstance =  await mongoose.connect(`${process.env.DB_STRING}/${DB_NAME}`)
        console.log("MongoDb Connected !! DB Host ",connectionInstance.connection.host)
    } catch (error) {
        console.error("MongoDB connection error : " , error)
        process.exit(1)
    }
}

export default connectDB;