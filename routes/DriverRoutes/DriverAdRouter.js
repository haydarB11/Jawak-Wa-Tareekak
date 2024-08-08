const {
	addAds,
	getAllDriversAds,
	getAllMyAds,
	editAdd,
	deleteManyAdds,
} = require('../../controllers/DriverControllers/DriverAdController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', addAds);

router.put('/:add_id', editAdd);

router.get('/mine', getAllMyAds);

router.delete('/', deleteManyAdds);

router.get('/', getAllDriversAds);

module.exports = router;