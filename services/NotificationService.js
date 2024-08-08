const { Notification, NotificationUser } = require('../models');
const httpStatus = require('../utils/httpStatus');
const sendNotifications = require('../utils/notification/notification');

class NotificationService {

    constructor(data) {
        this.title_en = data.title_en;
        this.title_ar = data.title_ar;
        this.content_en = data.content_en;
        this.content_ar = data.content_ar;
    }

    static async send(splitTokens, data) {
        try {
            const messagesPromises = splitTokens.map( async (tokens) => {
                return sendNotifications(tokens, data.title, data.body);
            });
            const response = await Promise.all(messagesPromises);
            return {
                data: "Successfully sent message",
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneLanguage(language = 'ar', user_id) {
        try {
            const notifications = await Notification.findAll({
                attributes: [
                    'id',
                    [`title_${language}`, 'title'],
                    [`content_${language}`, 'content'],
                    'created_at'
                ],
                include: [
                    {
                        attributes: [
                            'is_read'
                        ],
                        required: true,
                        model: NotificationUser,
                        as: 'notification_users',
                        where: {
                            user_id: user_id
                        }
                    }
                ],
                raw: true,
                order: [["id", 'DESC']]
            });
            return {
                data: notifications,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    async add () {
        try {
            const notification = await Notification.create(this);
            return {
                data: notification,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

}

module.exports = { NotificationService };