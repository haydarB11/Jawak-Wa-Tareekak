const {
	getAllLines,
} = require('../../controllers/UserControllers/LineController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.get('/', getAllLines);

module.exports = router;