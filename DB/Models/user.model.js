import { Schema, model } from "mongoose";
import bc from 'bcryptjs'
import { systemRole } from "../../Utils/systemRoles.js";

const userSchema = new Schema({
    fristName : String,
    lastName : String,
    email : {
        type : String,
        unique : true
    },
    password : String,
    gender : {
        type : String,
        enum : ['female' , 'male']
    },
    profile_pic : String,
    profile_picPublicId : String,
    isConfirmed : {
        type : Boolean ,
        default : false
    },
    isLoggedIn: {
        type : Boolean,
        default : false
    },
    covers : [String],
    coverPublicIds : [String],
    roles : {
        type : String,
        default : systemRole.USER,
        enum : [systemRole.ADMIN , systemRole.SUPER_ADMIN , systemRole.USER]
    }
},{
    timestamps : true
})

userSchema.pre("save" , function(next , doc){
    this.password = bc.hashSync(this.password , +process.env.SALT_ROUNDS)
    next()
})

const userModel = model.User || model('User' , userSchema);
export default userModel;