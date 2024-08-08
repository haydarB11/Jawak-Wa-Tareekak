const {
	getAllLines,
} = require('../../controllers/DriverControllers/LineController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.get('/', getAllLines);

module.exports = router;