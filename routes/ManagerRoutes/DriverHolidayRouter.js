const {
	addDriverHolidays,
	getAllDriverHolidays,
	deleteManyDriverHolidays,
} = require('../../controllers/ManagerControllers/DriverHolidayController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/:driver_id', addDriverHolidays);

router.get('/:driver_id', getAllDriverHolidays);

router.delete('/', deleteManyDriverHolidays);

module.exports = router;