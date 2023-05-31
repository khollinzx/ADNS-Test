/**
 * Import all necessary modules
 */
const express = require('express');
const cors = require('cors');
const { errorResponse, responseCode, successResponse} = require('./src/utilities/helpers');
const path = require("path");
const { port, nodeEnv } = require('./config');

// Initialize App
const app = express();

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// set express view engine
app.set('view engine', 'ejs');

// this preview the home page
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
    res.render(path.join(__dirname,"src/views/pages/index"), {port, nodeEnv});
});

// Accept only application/json
// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
    if (req.headers.accept !== 'application/json') { return errorResponse(res, 415, 'Header Accept type is required', ['Pls add application/json to the accept header.']); }

    next();
});

// Add application/json as content-type header to response
app.use((req, res, next) => {
    res.setHeader('charset', 'utf-8');
    res.setHeader('content-type', 'application/json');
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application Route
const apiRoutes = require('./src/routes');

// Set the default route
app.use('/api/v1', cors(corsOptions), apiRoutes);

// handle 404 error
app.use((req, res, next) => {
    errorResponse(res, responseCode.NOT_FOUND, 'Not Found', ["The resource you're trying to access was not found.."]);
    next();
});

/**
 * handle errors
 */
app.use((err, req, res) => {
    if (err.status === 404) { errorResponse(res, responseCode.NOT_FOUND, 'Not Found', ['The resource you\'re trying to access was not found.']); } else {
        errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'Server error', [err]);
    }
});

module.exports = app;
