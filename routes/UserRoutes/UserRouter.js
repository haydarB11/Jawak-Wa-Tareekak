const {
	userLogin,
	userRegister,
	editOwnAccount,
	deleteAccount,
	verifyOtp,
	sendOTP,
	resetPassword,
	getAuth,
	getAllAvailableDrivers,
} = require('../../controllers/UserControllers/UserController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.post('/login', userLogin);

router.post('/', userRegister);

router.post('/verify', verifyOtp);

router.get('/otp', sendOTP);

router.use(isAuth);

router.put('/', editOwnAccount);

router.get('/', getAuth);

router.post('/reset-password', resetPassword);

router.delete('/', deleteAccount);

router.get('/drivers', getAllAvailableDrivers);

module.exports = router;