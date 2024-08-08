const {
	userLogin,
	userRegister,
	editOwnAccount,
	deleteAccount,
	verifyOtp,
	sendOTP,
	resetPassword,
	getAuth,
	getAllDrivers,
	getAllAvailableDrivers,
} = require('../../controllers/DriverControllers/UserController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.post('/login', userLogin);

router.post('/', userRegister);

router.post('/verify', verifyOtp);

router.get('/otp', sendOTP);

router.use(isAuth);

router.put('/', editOwnAccount);

router.get('/', getAuth);

router.get('/get', getAllDrivers);

router.get('/get/available', getAllAvailableDrivers);

router.post('/reset-password', resetPassword);

router.delete('/', deleteAccount);

module.exports = router;