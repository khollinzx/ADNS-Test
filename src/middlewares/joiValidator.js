const Joi = require('joi');
const {validateRequest} = require("../utilities/helpers");

module.exports =  class JoiValidator {

    /**
     * Sign Up validation
     * @param req
     * @param res
     * @param next
     */
    static signup = async (req, res, next) => {
        const UserSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            confirm_password: Joi.string().min(8).required()
        });
        await validateRequest(req.body, res, next, UserSchema)
    }

    /**
     * Login validation
     * @param req
     * @param res
     * @param next
     */
    static login = async (req, res, next) => {
        const UserSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
        await validateRequest(req.body, res, next, UserSchema)
    }
}
