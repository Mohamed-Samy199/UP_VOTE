import userModel from "../DB/Models/user.model.js";
import { tokenData } from "../Utils/token.js";


export const auth = ()=>{
    return async (req , res , next) =>{
        const {authintaction} = req.headers;
        if(!authintaction){
            return res.json({message : "please enter your token"})
        }
        if(!authintaction.startsWith(process.env.PREFIX_TOKEN)){
            return res.json({message : "prefix is wrong"})
        }
        const token = authintaction.split(process.env.PREFIX_TOKEN)[1]
        const decoded = tokenData({payload : token})
        if(!decoded || !decoded._id){
            return res.json({message : 'in-valid token payload'})
        }
        const user = await userModel.findById(decoded._id , '-password');
        req.user = user;
        next()
    }
}

export const authoriation = (accessRoles)=>{
    return (req , res , next) =>{
        const {role} = req.user;
        if(!accessRoles.includes(role)){
            return next(new Error('un-authoriation', {cause : 403}))
        }
        next()
    }
}