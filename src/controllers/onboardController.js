const {Op} = require('sequelize')

const { errorResponse, successResponse, comparePasswords, generateJWT, responseCode, hashPassword ,generateRandomNumber}
    = require('../utilities/helpers')
const Controller = require('../controllers/controller')
const userRepo = require('../database/repositories/userRepository')
const walletRepo = require('../database/repositories/walletRepository')
const bcrypt = require("bcrypt");

module.exports = class OnboardingController extends Controller {
    constructor() {
        super();
        this.userModel = new userRepo();
        this.walletModel = new walletRepo();
    }

    /**
     *
     * Admin Welcome controller
     * @static
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    welcome = async (req, res) => {
        try {
            return successResponse(res, responseCode.SUCCESS, 'Welcome to ADNS-Test');
        } catch (err) {
            console.log(err);
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

    /**
     *
     * Admin signin controller
     * @static
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await this.userModel.queryModel({where: {email}});
            if (!user) return errorResponse(res, responseCode.BAD_REQUEST, 'incorrect login credentials.');
            const validpass = await comparePasswords(password, user.password);
            if (!validpass) return errorResponse(res, responseCode.BAD_REQUEST, 'incorrect password.');
            delete user.dataValues.password;
            const token = generateJWT({ id: user.id, email });
            return successResponse(res, responseCode.SUCCESS, 'user login successful.', {user: user, access_token: token});
        } catch (err) {
            console.log(err);
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

    /**
     *
     * Admin sign up controller
     * @static
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    signUp = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const checkEmail = await this.userModel.getModelByCondition({where: {email}});
            if (checkEmail) return errorResponse(res, responseCode.BAD_REQUEST, 'an account with email already exists.');
            const hashPassword = await bcrypt.hashSync(password, 10);
            const payload = {
                name,
                email,
                password: hashPassword
            }
            const user = await this.userModel.createNewUser(payload);
            if(user) {
                await this.walletModel.create({user_id: user.dataValues.id})
            }
            delete user.dataValues.password;
            const token = await generateJWT({ id: user.id, email });
            return successResponse(res, responseCode.SUCCESS, 'account created successful.', {user: user, access_token: token});
        } catch (err) {
            console.log(err);
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

}
