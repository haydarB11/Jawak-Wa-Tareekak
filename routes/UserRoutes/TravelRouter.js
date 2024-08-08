const {
	getAllAvailableTravelsForOneLines,
} = require('../../controllers/UserControllers/TravelController');
const {
	addPrivateTravelReservation,
	getAllMyFuturePrivateTravelsDependingOnStatus,
	getAllMyOldPrivateTravels,
	editPrivateTravel,
	addCode,
	getPrivateTravelDependingOnCode,
} = require('../../controllers/UserControllers/PrivateTravelController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

// private travel reservation

router.post('/code', addCode);

router.post('/private', addPrivateTravelReservation);

router.get('/private/code', getPrivateTravelDependingOnCode);

router.put('/private/:private_travel_id', editPrivateTravel);

router.get('/private/future', getAllMyFuturePrivateTravelsDependingOnStatus);

router.get('/private/old', getAllMyOldPrivateTravels);

// travel

router.get('/:line_id', getAllAvailableTravelsForOneLines);

module.exports = router;