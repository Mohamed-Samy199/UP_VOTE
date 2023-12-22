import commModel from "../../DB/Models/comment.model.js";
import productModel from "../../DB/Models/product.model.js";
import replyModel from "../../DB/Models/reply.model.js";

export const addComment = async (req , res , next) =>{
    const {commBody , productId} = req.body;
    const {_id} = req.user;
    const product = await productModel.findOne({_id : productId})
    if(!product){
        return next(new Error('in-valid product id' , {cause : 400}))
    }
    const comment = new commModel({commBody , productId , commentBy : _id});
    const saveComment = await comment.save();
    const check = await productModel.updateOne({_id : productId},{
        $push: {
            comments : comment._id
        }
    })
    if(!check){
        return next(new Error('push in fail' , {cause : 4000}))
    }
    res.status(200).json({message : "Comment Added" , saveComment})
}
export const deletedComment = async (req , res , next) =>{
    const {commentId} = req.params;
    const {_id} = req.user;
    const deleteComm = await commModel.findOneAndDelete({_id : commentId , commentBy : _id});
    if(!deleteComm){
        return next(new Error('delete fail' , {caues : 400}))
    }
    const check = await productModel.updateOne({_id : deleteComm.productId} , {
        $pull : {
            comments : deleteComm._id
        }
    })
    if(!check.modifiedCount){
        return next(new Error('pulling fail' , {caues : 400}))
    }
    res.status(200).json({message : "Done"})
}
export const addReply = async (req , res , next) =>{
    const {replyBody , commentId} = req.body;
    const { _id } = req.user;
    const comment = await commModel.findById(commentId);
    if(!comment){
        return next(new Error('in-valid comment id' , {caues : 400}))
    }
    const newReply = new replyModel({replyBody , commentId , replyBy : _id});
    const saveReply = await newReply.save()
    const check = await commModel.updateOne({_id : commentId} , {
        $push : {
            replies : newReply._id
        }
    })
    if(!check.modifiedCount){
        return next(new Error('pushing fail' , {caues : 400}))
    }
    res.status(200).json({message : "Done" , saveReply})
}
export const addReplyOnReply = async (req , res , next) =>{
    const {replyBody , commentId} = req.body; 
    const { _id } = req.user;
    const comment = await replyModel.findById(commentId);
    if(!comment){
        return next(new Error('in-valid comment id' , {caues : 400}))
    }
    const newReply = new replyModel({replyBody , commentId , replyBy : _id});
    const saveReply = await newReply.save()
    const check = await replyModel.updateOne({_id : commentId} , {
        $push : {
            replies : newReply._id
        }
    })
    if(!check.modifiedCount){
        return next(new Error('pushing fail' , {caues : 400}))
    }
    res.status(200).json({message : "Done" , saveReply})
}