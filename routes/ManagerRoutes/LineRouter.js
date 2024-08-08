const {
	addLine,
	deleteLine,
	editLine,
	getAllLines
} = require('../../controllers/ManagerControllers/LineController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', addLine);

router.put('/:line_id', editLine);

router.delete('/', deleteLine);

router.get('/', getAllLines);

module.exports = router;