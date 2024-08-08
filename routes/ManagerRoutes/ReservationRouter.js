const {
	changeStatusOfManyReservation,
	deleteReservation,
	editReservation,
	addReservation,
	getAllReservationsDependingOnStatus,
	
} = require('../../controllers/ManagerControllers/ReservationController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', addReservation);

router.put('/update-many', changeStatusOfManyReservation);

router.put('/:reservation_id', editReservation);

router.delete('/', deleteReservation);

router.get('/', getAllReservationsDependingOnStatus);

module.exports = router;