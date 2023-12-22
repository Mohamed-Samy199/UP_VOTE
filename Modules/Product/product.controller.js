import commModel from "../../DB/Models/comment.model.js";
import productModel from "../../DB/Models/product.model.js";
import { pagination } from "../../Service/pagination.js";
import cloudinary from "../../Utils/cloudinary.js";

export const addProduct = async(req , res , next)=>{
    const {title , caption} = req.body;
    const {_id , fristName} = req.user;
    if(!req.files.length){
        return next(new Error('please select your images' , {caues : 400}))
    } 
    let imageArr = [];
    let publicTdsArr = [];
    for (const file of req.files) {
        const {secure_url , public_id} = await cloudinary.uploader.upload(file.path, {
            folder : `Products/${fristName}`
        }) 
        imageArr.push(secure_url);
        publicTdsArr.push(public_id);
    }
    const product = new productModel({
        title, caption , Images : imageArr , publicIds : publicTdsArr , createdBy : _id
    })
    const saveProduct = await product.save()
    res.status(201).json({message : 'Done' , saveProduct})
}
export const getAllProducts = async(req , res , next)=>{
    const {page , size} = req.query
    const {perPage , skip , prePage , nextPage , currentPage} = pagination({page , size})
    const allNumberOfPages = await productModel.find({isDeleted : false})
    const products = await productModel.find({isDeleted : false}).populate([{
        path : 'comments',
        populate : [{
            path : 'commentBy',
            select : 'fristName'
        }],
        // match : {
        //     commBody: "cooment 3"
        // }
    },{
        path : 'createdBy',
        select : 'fristName'
    }]).limit(perPage).skip(skip)
    if(!products.length){
        return res.status(200).json({message : "no product "})
    }
    const totalPages = Math.ceil(allNumberOfPages.length / perPage)
    res.status(200).json({message : "Done" , data : {products} , meta : {perPage , skip , prePage , nextPage , currentPage , totalPages}})
}
export const likeProduct = async (req , res , next) =>{
    const {productId} = req.params;
    const {_id} = req.user;
    const product = await productModel.findOneAndUpdate({_id : productId , unlikes : { $ne : _id}} , {
        $addToSet : {
            likes : _id
        }
    },{
        new : true
    })
    if(!product){
        return next(new Error('in-valid product' , {caues : 400}))
    }
    // product.totalVotes = product.likes.length - product.unlikes.length;
    // await product.save()
    res.status(200).json({message : "Done" , product})
}
export const unlikeProduct = async (req , res , next) =>{
    const {productId} = req.params;
    const {_id} = req.user;
    const product = await productModel.findOneAndUpdate({_id : productId , likes : { $ne : _id}} , {
        $addToSet : {
            unlikes : _id
        }
    },{
        new : true
    })
    if(!product){
        return next(new Error('in-valid product' , {caues : 400}))
    }
    res.status(200).json({message : "Done" , product})
}
export const softDeleted = async (req , res , next) =>{
    const {prodId} = req.body;
    const product = await productModel.findOneAndUpdate({_id : prodId , isDeleted : false});
    if(!product){
        return next(new Error('in-valid product or ready soft deleted' , {caues : 400}))
    }
    res.status(200).json({message : 'Done'});
}

