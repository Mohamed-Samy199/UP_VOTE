import Joi from "joi";

export const signUpValidation = {
    body: Joi.object().required().keys({
        fristName: Joi.string().required().min(2).max(30).alphanum(),
        lastName: Joi.string().required().min(2).max(30).alphanum(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        cpass: Joi.string().required().valid(Joi.ref('password')),
        gender : Joi.string().optional()
    })
}
export const confirmValidation = {
    params : Joi.object().required().keys(({
        token : Joi.string().required()
    }))
}
export const loginValidation = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
}