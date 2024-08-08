const { BannerService } = require('../../services/BannerService');
const { NotificationService } = require('../../services/NotificationService');
const { NotificationUserService } = require('../../services/NotificationUserService');
const { UserService } = require('../../services/UserService');
const sendNotificationsMulticast = require('../../utils/notification/notification');


module.exports = {

    addBanner: async (req, res) => {
        const data = req.body;
        if (req.file?.path) {
            data.image = req.file.path;
        } else {
            return res.status(400).send({
                data: 'file is required',
            });
        }
        const result = await new BannerService(data).add();
        let users = await UserService.getTokenFromDataBase();
        if (users.length > 0) {
            let tokens = await UserService.splitTokens(users, 500);
            // tokens = Promise.resolve(tokens);
            let title_en = "new advertisement";
            let content_en = "new advertisement";
            let title_ar = "اعلان جديد";
            let content_ar = "اعلان جديد";
            users = await UserService.getAllForSpecificTypes(['user']);
            const notification = await new NotificationService({title_ar, title_en, content_ar, content_en}).add();
            const factoredNotificationUsers = users.data.map(user => ({
                user_id: user.id,
                notification_id: notification.data.id
            }));
            const notificationUsers = await NotificationUserService.addMany(factoredNotificationUsers);
            tokens.forEach((item) => {
                sendNotificationsMulticast(item, title_ar, content_ar);
            });
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteBanner: async (req, res) => {
        const result = await BannerService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editBanner: async (req, res) => {
        const data = req.body;
        data.id = req.params.banner_id;
        data.image = req.file?.path;
        const result = await BannerService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllBanners: async (req, res) => {
        const result = await BannerService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

}