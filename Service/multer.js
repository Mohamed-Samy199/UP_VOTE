import multer from "multer";

export const validationObject = {
    image : ["image/png" , "image/jpeg" , "image/gif"],
    file : ['application/pdf']
}

export const myMulter = ({customValidation = validationObject.image} = {}) =>{
    const storage = multer.diskStorage({})
    const fileFilter = (req , file , cb) =>{
        if(!customValidation.includes(file.mimetype)){
            return cb(new Error('invalid type extantion' , {cause : 400}) , false)
        }
        cb(null , true)
        
    }
    const upload = multer({fileFilter , storage})
    return upload
}