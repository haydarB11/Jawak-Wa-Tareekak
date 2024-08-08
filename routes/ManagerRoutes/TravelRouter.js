const {
	addTravel,
	deleteTravel,
	editTravel,
	getAllTravels,
	getAllTravelsForOneLine,
	getAllFutureTravelsForOneDriver,
	getAllOldTravelsForOneDriver,
} = require('../../controllers/ManagerControllers/travelController');
const {
	addPrivateTravel,
	deletePrivateTravel,
	editPrivateTravel,
	getAllPrivateTravelsDependingOnStatus,
	changeStatusOfManyPrivateTravel,
	addCode,
} = require('../../controllers/ManagerControllers/PrivateTravelController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

// private travel reservation

router.post('/private', addPrivateTravel);

router.put('/private/update-many', changeStatusOfManyPrivateTravel);

router.put('/private/:private_travel_id', editPrivateTravel);

router.delete('/private', deletePrivateTravel);

router.get('/private', getAllPrivateTravelsDependingOnStatus);

// somewhere between

router.get('/old/driver/:driver_id', getAllOldTravelsForOneDriver); // test

router.get('/future/driver/:driver_id', getAllFutureTravelsForOneDriver); // test

// travel

router.post('/', addTravel);

router.put('/:travel_id', editTravel);

router.delete('/', deleteTravel);

router.get('/', getAllTravels);

router.get('/:line_id', getAllTravelsForOneLine);

module.exports = router;