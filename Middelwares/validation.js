export const validation = (schema)=>{
    return (req , res , next)=>{
        const requistKeys = ["body" , "params" , "query", "headers" , "file" , "files"]
        let validationErroeArr = []
        for (const key of requistKeys) {
            if(schema[key]){
                const validationReslut = schema[key].validate(req[key] , {abortEarly : false})
                if(validationReslut?.error?.details){
                    validationErroeArr.push(validationReslut.error.details)
                }
            }
        }
        if(validationErroeArr.length){
            return res.json({validation_Error : "validation error" , validationErroeArr})
        }
        next()
    }
}