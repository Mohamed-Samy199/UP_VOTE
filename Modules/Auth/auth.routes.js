import { Router } from "express";
import { asyncHandler } from "../../Utils/errorHandler.js";
import { confirmEmail, forgetPass, login, refrashToken, resetPassword, signOut, signUp, } from "./auth.controller.js";
import { validation } from "../../Middelwares/validation.js";
import { confirmValidation, loginValidation, signUpValidation } from "./auth.validation.js";

const userRouter = Router();

userRouter.post('/signup', validation(signUpValidation) , asyncHandler(signUp))
userRouter.get('/confirmationEmail/:token' , validation(confirmValidation), asyncHandler(confirmEmail))
userRouter.get('/refrash/:email', asyncHandler(refrashToken))

userRouter.post('/signin' , validation(loginValidation) , asyncHandler(login))
userRouter.patch('/signout' , asyncHandler(signOut))

userRouter.get('/forget', asyncHandler(forgetPass))
userRouter.post('/restPass/:token', asyncHandler(resetPassword))












// userRouter.patch('/logout', asyncHandler(signOut))



// userRouter.patch('/updatePass', auth(), asyncHandler(updatePass))

// userRouter.patch('/profile', auth(), myMulter({}).single('pic'), asyncHandler(profilPic))


export default userRouter;