import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const userRouter = Router()

userRouter.post("/register" , upload.fields([
    {
        name:"avatar",
        maxCount: 1
    },
]) , registerUser)

userRouter.post('/login' , loginUser)

userRouter.post('/change-password' , verifyJWT , changeCurrentPassword)
userRouter.get('/current-user' , verifyJWT , getCurrentUser)
userRouter.patch('/avatar' , verifyJWT ,updateUserAvatar)
userRouter.patch('/update-account' , verifyJWT ,updateAccountDetails)

export default userRouter;