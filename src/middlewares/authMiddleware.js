/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
/* eslint-disable camelcase */
const {
    responseCode, errorResponse, verifyJWT, getResourceOrMetricName, checkForResourceOrMetricAndReturnPrivilege, resolveAccessWithPrivilegeAndRequestMethod, checkIfMetricOrResourceRoute,
} = require('../utilities/helpers');

module.exports = class Auth {
    constructor() {

    }

    /**
     *
     * this method verifies the jwt stored in the header and stores the decoded info to req.currentAdmin
     * @static
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {*}
     */
    currentUser(req, res, next) {
        try {
            const { authorization } = req.headers;

            if (!authorization) return errorResponse(res, responseCode.UNAUTHORIZED, 'Please input authorization token');
            const token = authorization.split(' ')[1];

            try {
                req.currentUser = verifyJWT(token);
            } catch (error) {
                return errorResponse(res, responseCode.UNAUTHORIZED, 'Authentication failed.');
            }
            return next();
        } catch (err) {
            console.log(err);
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

};
