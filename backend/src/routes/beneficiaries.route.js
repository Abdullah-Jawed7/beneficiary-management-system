import { Router } from "express";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createUserAndGenerateToken, deleteBeneficiary, getAllBeneficiary, getAllTokens, getBeneficiary, updateBeneficiary } from "../controllers/beneficiaries.controller.js";


const BeneficiaryRouter = Router();

BeneficiaryRouter.post('/generate-token' , verifyJWT , createUserAndGenerateToken)
BeneficiaryRouter.get('/get-beneficiary' , verifyJWT , getAllBeneficiary)
BeneficiaryRouter.get('/get-beneficiary/:id' , verifyJWT , getBeneficiary)
BeneficiaryRouter.patch('/get-beneficiary/:id' , verifyJWT , updateBeneficiary)
BeneficiaryRouter.delete('/get-beneficiary/:id' , verifyJWT , deleteBeneficiary)

BeneficiaryRouter.get('/get-token' , verifyJWT , getAllTokens)


export default BeneficiaryRouter;