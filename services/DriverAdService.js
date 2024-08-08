const { 
    DriverAd,
    User,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class DriverAdService {

    constructor(data) {
        this.content = data.content;
        this.driver_id = data.driver_id;
    }

    async add() {
        try {
            const driverAd = await DriverAd.create(this);
            return {
                data: driverAd,
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
            const driverAd = await DriverAd.findByPk(data.id);
            driverAd.content = data.content || driverAd.content;
            await driverAd.save();
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

    static async delete(ids, driver_id) {
        try {
            const deletedDriverAds = await DriverAd.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    },
                    driver_id: driver_id
                }
            });
            if (deletedDriverAds > 0) {
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

    static async getAllWithoutMe(driver_id) {
        try {
            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            const DriverAds = await DriverAd.findAll({
                include: [
                    {
                        attributes: [
                            'phone'
                        ],
                        model: User,
                        as: 'driver'
                    }
                ],
                where: {
                    driver_id: {
                        [Op.ne]: driver_id
                    },
                    created_at: {
                        [Op.gte]: lastWeek
                    }
                }
            });
            return {
                data: DriverAds,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getById(id, driver_id) {
        try {
            const DriverAds = await DriverAd.findOne({
                where: {
                    driver_id: driver_id,
                    id: id
                }
            });
            return {
                data: DriverAds,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllMine(driver_id) {
        try {
            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            const DriverAds = await DriverAd.findAll({
                include: [
                    {
                        attributes: [
                            'phone'
                        ],
                        model: User,
                        as: 'driver'
                    }
                ],
                where: {
                    driver_id: driver_id,
                    created_at: {
                        [Op.gte]: lastWeek
                    }
                }
            });
            return {
                data: DriverAds,
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

module.exports = { DriverAdService };