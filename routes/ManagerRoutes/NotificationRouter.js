const {
	deleteManyNotification,
    editManyNotification,
    editOneNotification,
    getAllNotifications,
    sendNotification,
} = require('../../controllers/ManagerControllers/NotificationController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.post('/', sendNotification);

router.put('/', editManyNotification);

router.patch('/:notification_id', editOneNotification);

router.delete('/', deleteManyNotification);

router.get('/', getAllNotifications);

module.exports = router;