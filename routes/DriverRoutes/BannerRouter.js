const {
	getAllBanners,
} = require('../../controllers/DriverControllers/BannerController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.get('/', getAllBanners);

module.exports = router;