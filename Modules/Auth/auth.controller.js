import userModel from "../../DB/Models/user.model.js";
import { sendEmail } from "../../Service/sendEmail.js";
import { hashData } from "../../Utils/hash.js";
import { tokenData } from "../../Utils/token.js";
import bc from 'bcryptjs'
// lwamxmmwsapknpxibp@bbitj.com

export const signUp = async (req, res , next) => {
    const {fristName , lastName , email , password , cpass , gender} = req.body;
    const checkUser = await userModel.findOne({email}).select("-_id email")
    if(checkUser){
        return next(new Error('email is already exsit' , {cause : 409}))
    }
    const newUser = new userModel({fristName , lastName , email , password , cpass , gender})

    const token = tokenData({
        payload : {
            _id : newUser._id
        }
    })
    const confirmationLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmationEmail/${token}`;
    const refrashToken = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/refrash/${email}`
    const emailSend = await sendEmail({
        to: newUser.email,
        subject: 'conformation email',
        message: `<a href=${confirmationLink}>click to confirm</a> 
        <br/>
        <a href=${refrashToken}>refrash your token</a> `
    })
    if (emailSend) {
        await newUser.save();
        return res.json({ message: 'sign up success' })
    }
}
export const confirmEmail = async (req, res) => {
    const { token } = req.params;
    const decode = tokenData({ payload: token, generation: false })
    if (decode?._id) {
        await userModel.findOneAndUpdate({ _id: decode._id, isConfirmed: false }, { isConfirmed: true })
        res.status(200).json({ message: "confirmation success, please try to login" })
    }
}
export const refrashToken = async (req, res) => {
    const { email } = req.params;
    const token = tokenData({ payload: { email } })
    if (token) {
        return res.status(201).json({ message: "new token", token })
    }
    next(new Error("unknown error"))
}
export const login = async(req , res , next)=>{
    const {email , password} = req.body;
    const user = await userModel.findOne({email , isConfirmed : true})
    if(!user){
        return next(new Error('please enter a valid email' , {cause : 400}))
    }
    const match = bc.compareSync(password , user.password)
    if(!match){
        return next(new Error('in-valid login information' , {cause : 400}))
    }
    const token = tokenData({
        payload :{
            _id : user._id , email : user.email , isLoggedIn : true
        }
    })
    const loggedInUser = await userModel.findOneAndUpdate({_id : user._id} , {isLoggedIn : true})
    if(!loggedInUser){
        return next(new Error('please to login again' , {cause : 400}))
    }
    res.status(200).json({message : 'Login Success' , token})
}
export const forgetPass = async (req, res, next) => {
    const { email } = req.body;
    const emailExist = await userModel.findOne({ email });
    if (!emailExist) {
        return next(new Error('in-valid email', { cause: 401 }));
    }
    const token = tokenData({ payload: { _id: emailExist._id } });
    const restLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/restPass/${token}`;
    const message = `<a href=${restLink}>click to reset your password</a>`;
    const emailSend = await sendEmail({
        to: email,
        message,
        subject: 'Rest password Email'
    })
    if (!emailSend) {
        return next(new Error('send email fail', { cause: 500 }));
    }
    res.status(200).json({ message: 'please check your email' })
}
export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const decode = tokenData({ payload: token });
    if (!decode?._id) {
        return next(new Error('token decode fail', { cause: 400 }));
    }
    const hashPassword = bc.hashSync(newPassword , +process.env.SALT_ROUNDS)
    const user = await userModel.findOneAndUpdate({ _id: decode._id }, { password: hashPassword });
    if (!user) {
        return next(new Error('fail to reset password', { cause: 400 }));
    }
    res.status(200).json({ message: 'Done, please try to login' })
}
export const signOut = async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email })
    if (!user?.isLoggedIn) {
        return res.status(200).json({ message: "user not found" })
    }
    const userOut = await userModel.updateOne({ email }, { isLoggedIn: false })
    userOut.modifiedCount ? res.status(201).json({ message: "success" }) : next(Error('fail'), { cause: 400 })
}


