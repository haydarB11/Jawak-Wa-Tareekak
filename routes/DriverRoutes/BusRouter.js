const {
	editBus,
} = require('../../controllers/DriverControllers/BusController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.put('/:bus_id', editBus);

module.exports = router;