import mongoose,{Schema} from "mongoose"
const BeneficiariesSchema = new  Schema(
    {
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true, 
    },
    fullName:{
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    identityNumber:{
        type: String,
        required: true,
        unique: true,
    },
    contactNumber:{
        type: String,
        required: true,
        unique: true,
    },
     address:{
        type:String,
    },
    },
    {
      timestamps: true  
    })


    export const Beneficiaries  = mongoose.model("Beneficiaries", BeneficiariesSchema);