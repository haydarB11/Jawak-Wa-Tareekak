const { CancelReservationNoteService } = require('../../services/CancelReservationNote');
const { ReservationService } = require('../../services/ReservationService');

module.exports = {

    addReservation: async (req, res) => {
        const result = await new ReservationService(req.body).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteReservation: async (req, res) => {
        const result = await ReservationService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

    changeStatusOfManyReservation: async (req, res) => {
        const data = req.body;
        const {status, ids, note} = data;
        const result = await ReservationService.changeStatusOfMany(ids, status);
        if (status == 'rejected') {
            if (data.status == 'rejected') {
                const factoredCancelNote = ids.map( (id) => ({
                    note: note,
                    reservation_id: id,
                }));
                const cancelNotes = await CancelReservationNoteService.addMany(factoredCancelNote);
            }
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

    editReservation: async (req, res) => {
        const data = req.body;
        data.id = req.params.reservation_id;
        const result = await ReservationService.edit(data);
        if (data.status == 'rejected') {
            data.reservation_id = data.id;
            const cancelNote = await new CancelReservationNoteService(data).add();
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllReservationsDependingOnStatus: async (req, res) => {
        const result = await ReservationService.getAllDependingOnStatus(req.query.status);
        res.status(result.status).send({
            data: result.data,
        });
    },

}