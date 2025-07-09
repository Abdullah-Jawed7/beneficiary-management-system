import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createUserAndGenerateToken, deleteBeneficiary, deleteToken, getAllBeneficiary, getAllTokens, getBeneficiary, getDepartments, getToken, getTokenByUserId, getTokenStatus, updateBeneficiary, updateToken , getTokenByReceptionistId } from "../controllers/beneficiaries.controller.js";


const BeneficiaryRouter = Router();
BeneficiaryRouter.post('/generate-token' , verifyJWT , createUserAndGenerateToken)
// beneficiaries
BeneficiaryRouter.get('/get-beneficiary' , verifyJWT , getAllBeneficiary)
BeneficiaryRouter.get('/get-beneficiary/:id' , verifyJWT , getBeneficiary)
BeneficiaryRouter.patch('/get-beneficiary/:id' , verifyJWT , updateBeneficiary)
BeneficiaryRouter.delete('/get-beneficiary/:id' , verifyJWT , deleteBeneficiary)
// Tokens
BeneficiaryRouter.get('/get-token' , verifyJWT , getAllTokens)
BeneficiaryRouter.get('/get-token/:id' , verifyJWT , getToken)
BeneficiaryRouter.patch('/get-token/:id' , verifyJWT , updateToken)
BeneficiaryRouter.delete('/get-token/:id' , verifyJWT , deleteToken)
// token by receptionist Id
BeneficiaryRouter.get('/get-user-token/:id' , verifyJWT , getTokenByUserId)
// token by beneficiary Id
BeneficiaryRouter.get('/get-recep-token/:id' , verifyJWT , getTokenByReceptionistId)
// list of all available status for tokens
BeneficiaryRouter.get('/get-status' , verifyJWT , getTokenStatus)
BeneficiaryRouter.get('/get-departments' , verifyJWT , getDepartments)





export default BeneficiaryRouter;