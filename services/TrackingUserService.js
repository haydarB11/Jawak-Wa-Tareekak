const { 
    TrackingUser,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class TrackingUserService {

    constructor(data) {
        this.user_id = data.user_id;
        this.private_travel_id = data.private_travel_id;
    }

    async add() {
        try {
            const trackingUsers = await TrackingUser.create(this);
            return {
                data: trackingUsers,
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
            const banner = await Banner.findByPk(data.id);
            banner.title_en = data.title_en || banner.title_en;
            banner.title_ar = data.title_ar || banner.title_ar;
            banner.image = data.image || banner.image;
            if (data.is_show == true || data.is_show == false) { 
                banner.is_show = data.is_show;
            }
            await banner.save();
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

    static async delete(ids) {
        try {
            const deletedBanners = await Banner.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedBanners > 0) {
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

    static async getAll() {
        try {
            const banners = await Banner.findAll({});
            return {
                data: banners,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneLanguage(language) {
        try {
            const title = language === 'ar' ? 'Banner.title_ar' : 'Banner.title_en';
            const banners = await Banner.findAll({
                attributes: [
                    'id',
                    [`title_${language}`, 'title'],
                    'image'
                ],
                where: {
                    is_show: true
                }
            });
            return {
                data: banners,
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

module.exports = { TrackingUserService };