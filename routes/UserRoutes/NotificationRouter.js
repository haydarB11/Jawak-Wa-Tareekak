const {
	deleteManyNotification,
    editManyNotification,
    editOneNotification,
    getAllNotifications,
} = require('../../controllers/UserControllers/NotificationController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.put('/', editManyNotification);

router.patch('/:notification_id', editOneNotification);

router.delete('/', deleteManyNotification);

router.get('/', getAllNotifications);

module.exports = router;