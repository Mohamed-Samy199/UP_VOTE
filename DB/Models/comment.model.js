import { Schema, model } from "mongoose";
// comment - user ==> child to parent
// comment - product ==> parent to child

const commSchema = new Schema({
    commBody : {
        type : String,
        require : true
    },
    commentBy : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    productId : {
        type : Schema.Types.ObjectId,
        ref : 'Product'
    },
    replies : [{
        type : Schema.Types.ObjectId,
        ref : 'Comment'
    }]
},{
    timestamps : true
})



const commModel = model.Comment || model('Comment' , commSchema);
export default commModel;