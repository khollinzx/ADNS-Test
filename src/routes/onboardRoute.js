const express = require('express')
const joiValidator = require('../middlewares/joiValidator')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

const OnboardingController = require('../controllers/onboardController')

const onboardingController = new OnboardingController()
const auth = new authMiddleware()

router.get('/welcome', onboardingController.welcome);
router.post('/login', onboardingController.login );
router.post('/signup', [joiValidator.signup, onboardingController.signUp]);

//Selection
router.get('/selections', onboardingController.selectTypes );

//Auth user Section
router.get('/get_profile/', auth.currentUser, onboardingController.getProfileByUserId);

//Auth Section
router.get('/get_wallet/', auth.currentUser, onboardingController.getWalletByUserId);
router.post('/create_wallet/', auth.currentUser , joiValidator.createWallet, onboardingController.createUserWallet);

//Deposit and Withdrawal Section
router.post('/credit_wallet/', auth.currentUser, joiValidator.transactWallet, onboardingController.creditUserWallet);
router.post('/debit_wallet/', auth.currentUser , joiValidator.transactWallet, onboardingController.debitUserWallet);

module.exports = router;
