const { 
    CancelReservationNote,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class CancelReservationNoteService {

    constructor(data) {
        this.note = data.note;
        this.reservation_id = data.reservation_id;
        this.private_travel_id = data.private_travel_id;
    }

    async add() {
        try {
            const cancelNote = await CancelReservationNote.create(this);
            return {
                data: cancelNote,
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
            const cancelNotes = await CancelReservationNote.bulkCreate(data);
            return {
                data: cancelNotes,
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
            const cancelNote = await CancelReservationNote.findByPk(data.id);
            cancelNote.note = data.note || cancelNote.note;
            cancelNote.reservation_id = data.reservation_id || cancelNote.reservation_id;
            cancelNote.private_travel_id = data.private_travel_id || cancelNote.private_travel_id;
            await cancelNote.save();
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
            const deletedCancelNotes = await CancelReservationNote.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedCancelNotes > 0) {
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

module.exports = { CancelReservationNoteService };