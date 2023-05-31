/**
 * import the configuration file
 */

const config = require('../../config');
const fs = require('fs');
const { jwtKey } = config;

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const saltRounds = 10;
const Joi = require('joi');
// const moment = require('moment')

/** *******************************
 *  Response Code Helpers
 ********************************* */
exports.responseCode = {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOW: 405,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    ACCOUNT_NOT_VERIFIED: 209,
};
/**
 * get limit and ofset from page and size
 * @param {number} data
 * @param {number} page
 * @param {number} size
 * @returns { totalItems, resources, totalPages, currentPage }
 */
exports.pagingData = (data, page, size) => {
    const { count: totalItems, rows: resources } = data;
    const currentPage = page ? +page : 0;
    let totalPages = 1;
    totalPages = Math.ceil(totalItems / size);

    return {
        totalItems, resources, totalPages, currentPage,
    };
};

/**
 * capitalize each word
 * @param {string} str
 * @returns { string } string in title case
 */
exports.capitalizeEachWord = (str) => {
    return str.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase())
};


/**
 *
 * @param {object} res response object
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data
 * @returns {object} res
 */
exports.successResponse = function (res, statusCode = this.responseCode.SUCCESS,
                                    message = 'success', data = null) {
    res.status(statusCode).json({
        status: true,
        message,
        data,
    });
};



/**
 *
 * @param {object} res response object
 * @param {number} statusCode
 * @param {string} message
 * @param {*} errors
 * @param files
 * @returns {object} res
 */
exports.errorResponse = function (res, statusCode = this.responseCode.NOT_FOUND,
                                  message = 'error', errors = [], files) {
    if (files){
        const size = Object.keys(files).length;
        if(size > 0){
            for (const key in files) {
                fs.unlinkSync(files[key].path);
            }
        }
    }
    res.status(statusCode).json({
        status: false,
        message,
        errors,
    });
};


/** *******************************
 *  Paginator helper function
 *  TODO: Improve pagination
 ********************************* */

exports.pagination = function (limit) {
    return parseInt(limit || config.defaultRecordsPerPage);
};

exports.page = function (pageValue) {
    return parseInt(pageValue || config.defaultPage);
};

/** *******************************
 *  Validator helper function
 ********************************* */
exports.middleware = (schema, property) => (request, response, next) => {
    const { error } = schema.validate(request[property], {
        abortEarly: false,
        language: {
            key: '{{key}} ',
        },
    });
    const valid = error == null;
    if (valid) {
        next();
    } else {
        const { details } = error;
        const errors = details.map((i) => [i.message]);
        this.errorResponse(response, this.responseCode.UNPROCESSABLE_ENTITY, 'Validation Error', errors);
    }
};

/**
 * The validation rule
 * @param req
 * @param res
 * @param next
 * @param schema
 */
exports.validateRequest = (object, res, next, schema) => {

    const options = {
        abortEarly: false, // include all errors
        allowUnknown: false, // ignore unknown props
        // stripUnknown: true, // remove unknown props
    };
    const { error, data } = schema.validate(object, options);
    if (error) {
        /**
         * loop through the error messages and return readable error message
         */
        error.details.forEach((e) => {
            // FormattedError.push(e.message.replace(/"/g, ''));
            return this.errorResponse(
                res,
                this.responseCode.UNPROCESSABLE_ENTITY,
                e.message.replace(/"/g, ''),
                [],
                object.files,
            );
        });

        /**
         * returns a single error at a time
         */

    }
    // req.body = req.body;

    return next();
};


/**
 * hash passwords
 * @returns {Promise<void>}
 * @param password
 */
exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hashSync(password, salt);
};

/**
 * Compare passwords with Database
 * @param inputPassword
 * @param dbPassword
 */
exports.comparePasswords = (inputPassword, dbPassword) => {
    return bcrypt.compareSync(inputPassword, dbPassword);
};

/**
 *
 * @param payload
 * @returns {*}
 */
exports.generateJWT = (payload) => {
    return jwt.sign(payload, jwtKey, { expiresIn: '1d' });
};

/**
 *
 * @param token
 * @returns {*}
 */
exports.verifyJWT = (token) => jwt.verify(token, jwtKey);
