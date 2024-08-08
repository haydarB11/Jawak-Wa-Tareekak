const {
	addDays,
	getAllDays,
} = require('../../controllers/ManagerControllers/DayController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', addDays);

router.get('/', getAllDays);

module.exports = router;