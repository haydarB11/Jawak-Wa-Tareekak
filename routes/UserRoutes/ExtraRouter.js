const {
	getAllExtras
} = require('../../controllers/UserControllers/ExtraController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.get('/', getAllExtras);

module.exports = router;