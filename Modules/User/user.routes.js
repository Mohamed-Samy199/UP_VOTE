import { Router } from "express";
import { asyncHandler } from "../../Utils/errorHandler.js";
import { auth } from "../../Middelwares/authintaction.js";
import { myMulter } from "../../Service/multer.js";
import { coverPicture, profilePicture, updatePassword } from "./user.controller.js";

const userRouter = Router();

userRouter.patch('/profile' , auth() , myMulter({}).single('pic') , asyncHandler(profilePicture))
userRouter.patch('/cover' , auth() , myMulter({}).array('pic' , 2) , asyncHandler(coverPicture))

userRouter.patch('/updatePass' , auth() , asyncHandler(updatePassword))

export default userRouter;