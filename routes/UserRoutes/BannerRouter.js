const {
	getAllBanners,
} = require('../../controllers/UserControllers/BannerController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.get('/', getAllBanners);

module.exports = router;