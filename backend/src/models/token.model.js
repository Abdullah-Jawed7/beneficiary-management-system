import mongoose,{Schema} from "mongoose"
import {departments, status} from '../constants.js'

const tokenSchema = new  Schema(
    {
    department:{
        type:String,
        enum:departments,
        lowercase:true,
        required:true
    },
    status:{
        type:String,
        enum:status,
        lowercase:true,
        required:true,
        default:'pending',
    },
    purpose:{
        type:String,
        required:true,

    },
    receptionist:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    beneficiaries:{
        type:Schema.Types.ObjectId,
        ref:"Beneficiaries"
    }
    },
    {
      timestamps: true  
    })


    export const Token  = mongoose.model("Token", tokenSchema);