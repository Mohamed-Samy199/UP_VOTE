import jwt from "jsonwebtoken";

export const tokenGeneration = ({payload = {} , signature = process.env.TOKEN_KEY , expiresIn = '1hour'}) =>{
    if(Object.keys(payload).length){
        const token = jwt.sign(payload , signature , {expiresIn})
        return token
    }
    return false
}

export const tokenDecode = ({payload = '' , signature = process.env.TOKEN_KEY}) =>{
    if(!payload){
        return false
    }
    const decode = jwt.verify(payload , signature)
    return decode
}