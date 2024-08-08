const {
	addCommission,
	deleteCommissions,
	editCommission,
	getAllCommissions,
	getAllCommissionsForOneDriver,
} = require('../../controllers/ManagerControllers/CommissionController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', addCommission);

router.put('/:commission_id', editCommission);

router.delete('/', deleteCommissions);

router.get('/', getAllCommissions);

router.get('/driver/:driver_id', getAllCommissionsForOneDriver);

module.exports = router;