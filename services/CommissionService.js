const { 
    Commission,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class CommissionService {

    constructor(data) {
        this.driver_id = data.driver_id;
        this.amount = data.amount;
    }

    async add() {
        try {
            const commission = await Commission.create(this);
            return {
                data: commission,
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
            const commission = await Commission.findByPk(data.id);
            commission.driver_id = data.driver_id || commission.driver_id;
            commission.amount = data.amount || commission.amount;
            await commission.save();
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
            const deletedCommissions = await Commission.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedCommissions > 0) {
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
            const commissions = await Commission.findAll({
                order: [['id', 'DESC']]
            });
            return {
                data: commissions,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneDriver(driver_id) {
        try {
            const commissions = await Commission.findAll({
                where: {
                    driver_id: driver_id
                },
                order: [['id', 'DESC']]
            });
            return {
                data: commissions,
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

module.exports = { CommissionService };