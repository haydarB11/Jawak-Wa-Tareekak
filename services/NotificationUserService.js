const { 
    NotificationUser,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class NotificationUserService {

    constructor(data) {
        this.user_id = data.user_id;
        this.notification_id = data.notification_id;
        this.is_read = data.is_read;
    }

    async add() {
        try {
            const notificationUser = await NotificationUser.create(this);
            return {
                data: notificationUser,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async addMany(data) {
        try {
            const notificationUsers = await NotificationUser.bulkCreate(data);
            return {
                data: notificationUsers,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async edit(data) {
        try {
            const notificationUser = await NotificationUser.findOne({
                where: {
                    user_id: data.user_id,
                    notification_id: data.notification_id
                }
            });
            notificationUser.is_read = true;
            await notificationUser.save();
            return {
                data: 'updated',
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async editMany(data) {
        try {
            const notificationUser = await NotificationUser.update({is_read: true}, {
                where: {
                    user_id: data.user_id,
                    notification_id: {
                        [Op.in]: data.ids
                    }
                }
            });
            return {
                data: 'updated',
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async delete(data) {
        try {
            const deletedNotificationUser = await NotificationUser.destroy({
                where: {
                    notification_id: {
                        [Op.in]: data.ids,
                    },
                    user_id: data.user_id
                }
            });
            if (deletedNotificationUser > 0) {
                return {
                    data: 'deleted',
                    status: httpStatus.OK
                };
            } else {
                return {
                    data: 'something went wrong',
                    status: httpStatus.BAD_REQUEST
                };
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

}

module.exports = { NotificationUserService };