const { NotificationService } = require('../../services/NotificationService');
const { NotificationUserService } = require('../../services/NotificationUserService');
const { UserService } = require('../../services/UserService');
const httpStatus = require('../../utils/httpStatus');

module.exports = {

    sendNotification: async (req, res) => {
        try {
            const tokens = await UserService.getTokenFromDataBase();
            const splitTokens = await UserService.splitTokens(tokens, 500);
            const notification = await new NotificationService(req.body).add();
            const users = await UserService.getAll();
            const notificationUsers = users.data.map( user => ({
                user_id: user.id,
                notification_id: notification.data.id,
            }));
            const notificationUsersAdded = await NotificationUserService.addMany(notificationUsers);
            const result = await NotificationService.send(splitTokens, req.body);
            res.status(result.status).send({
                data: result.data,
            });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    },

    getAllNotifications: async (req, res) => {
        const result = await NotificationService.getAllForOneLanguage(req.query.language, req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editOneNotification: async (req, res) => {
        const data = req.params;
        data.user_id = req.user.id;
        const result = await NotificationUserService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editManyNotification: async (req, res) => {
        const data = req.body;
        data.user_id = req.user.id;
        const result = await NotificationUserService.editMany(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteManyNotification: async (req, res) => {
        const data = req.body;
        data.user_id = req.user.id;
        const result = await NotificationUserService.delete(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

}