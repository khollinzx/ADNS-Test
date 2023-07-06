const {Op} = require('sequelize')

const { errorResponse, successResponse, comparePasswords, generateJWT, responseCode, hashPassword ,generateRandomNumber}
    = require('../utilities/helpers')
const Controller = require('../controllers/controller')
const userRepo = require('../database/repositories/userRepository')
const walletRepo = require('../database/repositories/walletRepository')
const bcrypt = require("bcrypt");
const sendGridMail = require('../abstracts/implementations/sendGridService')

const mailer = new sendGridMail()

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
            // if(user) {
            //     await this.walletModel.create({user_id: user.dataValues.id})
            // }
            const mail = await mailer.sendEmail({
                subject: "Welcome",
                userEmail : user.email,
                userName : user.name,
                template : "welcome",
                variables: {link: "link", name: user.name}
            })

            delete user.dataValues.password;
            const token = await generateJWT({ id: user.id, email });
            return successResponse(res, responseCode.SUCCESS, 'account created successful.', {user: user, access_token: token});
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
    selectTypes = async (req, res) => {
        try {
            const types = [{"Flex": "Flex"}, {"Trybe": "Trybe"}];
            return successResponse(res, responseCode.SUCCESS, 'select account type.', types);
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
    getProfileByUserId = async (req, res) => {
        try {
            const user = await this.userModel.findUserByID(req.currentUser.id);

            if (!user) return errorResponse(res, responseCode.BAD_REQUEST, 'no record found.');

            return successResponse(res, responseCode.SUCCESS, 'wallet was retrieved.', user);

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
    getWalletByUserId = async (req, res) => {
        try {
            const wallet = await this.walletModel.findUserWalletByUserId(req.currentUser.id);

            if (!wallet) return errorResponse(res, responseCode.BAD_REQUEST, 'you are yet to create a wallet.');

            return successResponse(res, responseCode.SUCCESS, 'wallet was retrieved.', wallet);

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
    createUserWallet = async (req, res) => {
        try {
            const userId = req.currentUser.id;
            const record = await this.walletModel.findUserWalletByUserId(req.currentUser.id);
            const user = await this.userModel.findUserByID(req.currentUser.id);

            if (record) return errorResponse(res, responseCode.BAD_REQUEST, `you already have a ${record.wallet_type} wallet.`);

            const payload = {
                user_id: userId,
                wallet_type: req.body.wallet_type,
            }
            const wallet = await this.walletModel.create(payload);

            const mail = await mailer.sendEmail({
                subject: "Wallet Creation",
                userEmail : user.email,
                userName : user.name,
                template : "wallet-creation",
                variables: {wallet: req.body.wallet_type, name: user.name}
            })

            return successResponse(res, responseCode.SUCCESS, 'wallet creation was successful.', wallet);
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
    creditUserWallet = async (req, res) => {
        try {
            const wallet = await this.walletModel.findUserWalletByUserId(req.currentUser.id);
            const user = await this.userModel.findUserByID(req.currentUser.id);

            if (!wallet) return errorResponse(res, responseCode.BAD_REQUEST, 'you are yet to create a wallet.');

            const record = await this.walletModel.updateModel(wallet.id, {amount: (wallet.amount + req.body.amount)});

            const mail = await mailer.sendEmail({
                subject: "Wallet Transaction",
                userEmail : user.email,
                userName : user.name,
                template : "transactions",
                variables: {wallet: req.body.wallet_type, name: user.name, type: "Credited", amount: req.body.amount}
            })

            return successResponse(res, responseCode.SUCCESS, 'wallet was credited.', record);
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
    debitUserWallet = async (req, res) => {
        try {
            const wallet = await this.walletModel.findUserWalletByUserId(req.currentUser.id);
            const user = await this.userModel.findUserByID(req.currentUser.id);

            if (!wallet) return errorResponse(res, responseCode.BAD_REQUEST, 'you are yet to create a wallet.');

            if(wallet.amount < req.body.amount) return errorResponse(res, responseCode.BAD_REQUEST, 'insufficient fund.');

            const record = await this.walletModel.updateModel(wallet.id, {amount: (wallet.amount - req.body.amount)});

            const mail = await mailer.sendEmail({
                subject: "Wallet Transaction",
                userEmail : user.email,
                userName : user.name,
                template : "transactions",
                variables: {wallet: req.body.wallet_type, name: user.name, type: "Debited", amount: req.body.amount}
            })

            return successResponse(res, responseCode.SUCCESS, 'wallet was debited.', record);
        } catch (err) {
            console.log(err);

            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

}
