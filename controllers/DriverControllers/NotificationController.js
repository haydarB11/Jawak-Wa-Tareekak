const { NotificationService } = require('../../services/NotificationService');
const { NotificationUserService } = require('../../services/NotificationUserService');


module.exports = {

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