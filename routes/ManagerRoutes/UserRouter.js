const {
	managerLogin,
	editUser,
	editOwnAccount,
	deleteUser,
	addUser,
	getAllUsers,
	getMyOwnAccount,
	getAllUsersDependingOnType,
	addDriver,
	getAllUnAcceptedDrivers,
} = require('../../controllers/ManagerControllers/UserController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.post('/login', managerLogin);

router.use(isAuth);

router.put('/', editOwnAccount);

router.get('/', getMyOwnAccount);

router.post('/users/', addUser);

router.post('/drivers/', addDriver);

router.get('/drivers/un-accepted', getAllUnAcceptedDrivers);

router.delete('/users', deleteUser);

router.get('/users/', getAllUsers);

router.get('/users/type', getAllUsersDependingOnType);

router.put('/users/:user_id', editUser);

module.exports = router;