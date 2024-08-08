const {
	getAllDays,
	getAllPreventDays,
} = require('../../controllers/UserControllers/DayController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.get('/', getAllDays);

router.get('/prevent', getAllPreventDays);

module.exports = router;