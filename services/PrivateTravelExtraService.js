const { 
    ReservationExtra,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class PrivateTravelExtraService {

    constructor(data) {
        this.extra_id = data.extra_id;
        this.private_travel_id = data.private_travel_id;
    }

    static async addMany(data) {
        try {
            const extra = await ReservationExtra.bulkCreate(data);
            return {
                data: extra,
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
            const deletedReservationExtra = await ReservationExtra.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedReservationExtra > 0) {
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

    static async deleteAllForOnePrivate(private_travel_id) {
        try {
            const deletedReservationExtra = await ReservationExtra.destroy({
                where: {
                    private_travel_id: private_travel_id
                }
            });
            if (deletedReservationExtra >= 0) {
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

module.exports = { PrivateTravelExtraService };