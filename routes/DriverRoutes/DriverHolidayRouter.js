const {
	addDriverHolidays,
	getAllDriverHolidays,
} = require('../../controllers/DriverControllers/DriverHolidayController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', addDriverHolidays);

router.get('/', getAllDriverHolidays);

module.exports = router;