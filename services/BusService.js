const { 
    Bus,
    User,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class BusService {

    constructor(data) {
        this.line_id = data.line_id;
        this.user_id = data.user_id;
        this.capacity = data.capacity;
        this.brand = data.brand;
        this.model = data.model;
        this.is_show = data.is_show;
    }

    async add() {
        try {
            const bus = await Bus.create(this);
            return {
                data: bus,
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
            const bus = await Bus.findByPk(data.id);
            bus.line_id = data.line_id || bus.line_id;
            bus.user_id = data.user_id || bus.user_id;
            bus.is_show = data.is_show || bus.is_show;
            bus.capacity = data.capacity || bus.capacity;
            bus.brand = data.brand || bus.brand;
            bus.model = data.model || bus.model;
            if (data.is_show == true || data.is_show == false) { 
                bus.is_show = data.is_show;
            }
            await bus.save();
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
            const deletedBuses = await Bus.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedBuses > 0) {
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
            const buses = await Bus.findAll({
                include: [
                    {
                        model: User,
                        as: 'driver'
                    }
                ]
            });
            return {
                data: buses,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getForOneDriver(driver_id) {
        try {
            const bus = await Bus.findOne({
                where: {
                    user_id: driver_id
                }
            });
            return {
                data: bus,
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

module.exports = { BusService };