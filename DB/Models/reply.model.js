import { Schema, model } from "mongoose";
// comment - user ==> child to parent
// comment - product ==> parent to child

const replySchema = new Schema({
    replyBody : {
        type : String,
        require : true
    },
    replyBy : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    commentId : {
        type : Schema.Types.ObjectId,
        ref : 'Comment'
    },
    replies : [{
        type : Schema.Types.ObjectId,
        ref : 'Reply'
    }]
},{
    timestamps : true
})



const replyModel = model.replySchema || model('Reply' , replySchema);
export default replyModel;