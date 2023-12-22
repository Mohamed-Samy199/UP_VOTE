import { Schema, model } from "mongoose";
// product - comment ==> parent to child

const productSchema = new Schema({
    title : String,
    caption : String,
    Images : [{
        type : String,
        required : true
    }],
    publicIds : [{
        type : String,
        required : true
    }],
    likes : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    unlikes : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    comments : [{
        type : Schema.Types.ObjectId,
        ref : 'Comment'
    }],
    totalVotes : {
        type :Number,
        default : 0
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})

productSchema.post('findOneAndUpdate' , async function(){
    const {_id} = this.getQuery()
    // console.log({data : this.getQuery ,  _id});
    const product = await this.model.findOne({_id})
    // console.log(product);
    product.totalVotes = product.likes.length - product.unlikes.length;
    // product.__v = product.__v + 1
    await product.save()
})


const productModel = model.Product || model('Product' , productSchema);
export default productModel;