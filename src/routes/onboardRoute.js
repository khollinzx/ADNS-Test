const express = require('express')
const joiValidator = require('../middlewares/joiValidator')

const router = express.Router()

const OnboardingController = require('../controllers/onboardController')

const onboardingController = new OnboardingController()

router.get('/welcome', onboardingController.welcome);
router.post('/login', onboardingController.login, );
router.post('/signup', [joiValidator.signup, onboardingController.signUp]);

module.exports = router;
