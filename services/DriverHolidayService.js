const { 
    DriverHoliday,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class DriverHolidayService {

    constructor(data) {
        this.driver_id = data.driver_id;
        this.date = data.date;
    }

    async add() {
        try {
            const driverHolidays = await DriverHoliday.create(this);
            return {
                data: driverHolidays,
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
            const driverHolidays = await DriverHoliday.bulkCreate(data);
            return {
                data: driverHolidays,
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
            const deletedDriverHolidays = await DriverHoliday.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedDriverHolidays > 0) {
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

    static async deleteAllFutureForOneDriver(driver_id) {
        try {
            const now = new Date();
            const deletedDriverHolidays = await DriverHoliday.destroy({
                where: {
                    date: {
                        [Op.gte]: now
                    },
                    driver_id: driver_id,
                }
            });
            if (deletedDriverHolidays >= 0) {
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

    static async getAllForOneDriver(driver_id) {
        try {
            const banners = await DriverHoliday.findAll({
                where: {
                    driver_id: driver_id
                },
                order: [['id', 'DESC']]
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

    static async getAllFutureIdsForOneDriver(driver_id) {
        try {
            const date = new Date();
            const driverHolidays = await DriverHoliday.findAll({
                where: {
                    driver_id: driver_id,
                    date: {
                        [Op.gte]: date
                    }
                }
            });
            const ids = driverHolidays.map(holiday => holiday.id)
            return {
                data: ids,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getForOneDriverForOneDate(data) {
        try {
            const date = new Date(data.date);
            const driverHolidays = await DriverHoliday.findOne({
                where: {
                    driver_id: data.driver_id,
                    date: {
                        [Op.eq]: date
                    }
                }
            });
            return {
                data: (driverHolidays?.id)? true : false,
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

module.exports = { DriverHolidayService };