const { CommissionService } = require('../../services/CommissionService');
const { UserService } = require('../../services/UserService');
const { NotificationUserService } = require('../../services/NotificationUserService');
const sendNotificationsMulticast = require('../../utils/notification/notification');
const { StaticContentService } = require('../../services/StaticContentService');


module.exports = {

    addCommission: async (req, res) => {
        const data = req.body;
        const result = await new CommissionService(data).add();
        let user = await UserService.getById(data.driver_id);
        await UserService.edit({id: data.driver_id, payment: user.data.payment - data.amount});
        let title_en = "payment notification";
        let content_en = `you payed ${data.amount}`;
        let title_ar = "اعلان دفع";
        let content_ar = `تم دفع مبلغ ${data.amount}`;
        const notification = await new NotificationUserService({title_ar, title_ar, content_ar, content_ar}).add();
        const notificationUsers = await new NotificationUserService({user_id: data.driver_id, notification_id: notification.data.id}).add();
        if (user.data?.token) {
            sendNotificationsMulticast([user.data.token], title_ar, content_ar);
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteCommissions: async (req, res) => {
        const result = await CommissionService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editCommission: async (req, res) => {
        const data = req.body;
        data.id = req.params.commission_id;
        const result = await CommissionService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllCommissions: async (req, res) => {
        const result = await CommissionService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllCommissionsForOneDriver: async (req, res) => {
        const result = await CommissionService.getAllForOneDriver(req.params.driver_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

}