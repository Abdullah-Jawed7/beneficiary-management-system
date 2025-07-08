import { Router } from "express";
import { changeCurrentPassword, getAllUsers, getCurrentUser, getUser, loginUser, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";


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
userRouter.get('/get-user/:id' , verifyAdmin , getUser)
userRouter.get('/get-user' , verifyAdmin , getAllUsers)


export default userRouter;