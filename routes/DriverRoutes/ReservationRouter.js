const {
	addReservation,
	// editReservation,
	// getMyReservations,
} = require('../../controllers/DriverControllers/ReservationController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

// router.post('/', addReservation);

// router.put('/:reservation_id', editReservation);

// router.get('/', getMyReservations);

module.exports = router;