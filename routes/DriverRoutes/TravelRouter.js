const {
	getAllMyFutureTravels,
    getAllMyOldTravels,
    addPrivateTravelReservation,
    getAllFuturePendingWithoutDriverPrivateTravel,
    takePrivateTravel,
    editPrivateTravel,
} = require('../../controllers/DriverControllers/TravelController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');
const isSuperDriver = require('../../utils/auth/jwtMiddlewareSuperDriver');

router.use(isAuth);

router.get('/future', getAllMyFutureTravels);

router.get('/old', getAllMyOldTravels);

router.get('/private/choose', getAllFuturePendingWithoutDriverPrivateTravel);

router.post('/private/take/:private_travel_id', takePrivateTravel);

router.put('/private/edit/:private_travel_id', editPrivateTravel);

router.use(isSuperDriver);

router.post('/private', addPrivateTravelReservation);

module.exports = router;