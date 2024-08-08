const {
	addExtra,
	deleteExtra,
	editExtra,
	getAllExtras
} = require('../../controllers/ManagerControllers/ExtraController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', addExtra);

router.put('/:extra_id', editExtra);

router.delete('/', deleteExtra);

router.get('/', getAllExtras);

module.exports = router;