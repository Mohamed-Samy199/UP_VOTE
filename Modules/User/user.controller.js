import userModel from "../../DB/Models/user.model.js";
import cloudinary from "../../Utils/cloudinary.js";
import bc from 'bcryptjs';

export const profilePicture = async (req , res , next) =>{
    const {_id , fristName} = req.user;
    if(!req.file){
        return next(new Error('please upload your picture' , {cause : 400}));
    }
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {
        folder : `profile/${fristName}`
    })
    const user = await userModel.findByIdAndUpdate(_id , {
        profile_pic : secure_url,
        profile_picPublicId : public_id
    })
    if(!user){
        return next(new Error('please login frist' , {cause : 400}));
    }
    const deletedData = await cloudinary.uploader.destroy(user.profile_picPublicId);
    res.status(200).json({message : 'Done'});
}
export const coverPicture = async (req , res , next) =>{
    const { _id , fristName } = req.user;
    if(!req.files.length){
        return next(new Error('please upload your picture' , {cause : 400}));
    }
    let images = []
    let publicIds = [];
    for (const file of req.files) {
        const {secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
            folder : `cover/${fristName}`
        })
        images.push(secure_url);
        publicIds.push(public_id)
    }
    const user = await userModel.findByIdAndUpdate(_id , {
        covers : images,
        coverPublicIds : publicIds
    })
    if(!user){
        return next(new Error('please login frist' , {cause : 400}));
    }
    const data = await cloudinary.api.delete_resources(user.coverPublicIds);
    console.log(data);
    res.status(200).json({message : 'Done'})
}
export const updatePassword = async (req , res , next) =>{
    const {_id} = req.user;
    const { oldPass , newPass } = req.body;
    const user = await userModel.findById({_id});
    if(!user){
        return next(new Error('please login frist' , {cause : 400}));
    }
    const match = bc.compareSync(oldPass , user.password)
    if(!match){
        return next(new Error('wrong old password' , {cause : 400}));
    }
    const hashPass = bc.hashSync(newPass , +process.env.SALT_ROUNDS);
    const updatePass = await userModel.findByIdAndUpdate({_id} , {
        password : hashPass
    })
    if(!updatePass){
        return next(new Error('try again later' , {cause : 400}));
    }
    res.status(200).json({message : 'Done'})
}