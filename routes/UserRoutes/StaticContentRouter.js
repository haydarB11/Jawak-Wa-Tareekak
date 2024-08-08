const {
	getStaticContentDependingOnTitle,
	getPrivateTravelPriceAndCommission,
} = require('../../controllers/UserControllers/StaticContentController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.get('/', getStaticContentDependingOnTitle);

router.get('/travel-price', getPrivateTravelPriceAndCommission);

module.exports = router;