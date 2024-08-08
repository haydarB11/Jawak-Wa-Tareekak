const {
	addReservation,
	editReservation,
	getMyFutureReservationsDependingOnStatus,
	getMyOldReservations,
	getAllMyOldReservationsAndPrivateTravels,
	getAllMyFutureReservationsAndPrivateTravelsDependingOnStatus,
	getAllMyFutureReservationsAndPrivateTravels,
} = require('../../controllers/UserControllers/ReservationController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', addReservation);

router.get('/all-old', getAllMyOldReservationsAndPrivateTravels);

router.get('/old', getMyOldReservations);

router.get('/future', getMyFutureReservationsDependingOnStatus);

router.get('/all-future/status', getAllMyFutureReservationsAndPrivateTravelsDependingOnStatus);

router.get('/all-future', getAllMyFutureReservationsAndPrivateTravels);

router.put('/:reservation_id', editReservation);

module.exports = router;