const express = require('express');

const router = express.Router();

const onboardingRoute = require('./onboardRoute');
// const userRoute = require('./userRoute');

router.use('/onboard', onboardingRoute);
// router.use('users/', userRoute);


module.exports = router;
