const { BusService } = require('../../services/BusService');
const { CancelReservationNoteService } = require('../../services/CancelReservationNote');
const { PrivateTravelExtraService } = require('../../services/PrivateTravelExtraService');
const { PrivateTravelService } = require('../../services/PrivateTravelService');
const { UserService } = require('../../services/UserService');

module.exports = {

    addPrivateTravel: async (req, res) => {
        const data = req.body;

        const result = await new PrivateTravelService(data).add();
        if (data.extra_ids) {
            const factoredExtra = data.extra_ids.map((id) => ({
                extra_id: id,
                private_travel_id: result.data.id
            }));
            const privateExtra = await PrivateTravelExtraService.addMany(factoredExtra);
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

    deletePrivateTravel: async (req, res) => {
        const result = await PrivateTravelService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editPrivateTravel: async (req, res) => {
        const data = req.body;
        data.id = req.params.private_travel_id;
        if (data.driver_id) {
            const bus = await BusService.getForOneDriver(data.driver_id);
            data.bus_id = bus.data.id;
        }
        if (data.status == 'accepted') {
            data.code = generateRandomCode();
        }
        const result = await PrivateTravelService.edit(data);
        const deletedPrivateExtra = await PrivateTravelExtraService.deleteAllForOnePrivate(result.data.id);
        if (data.extra_ids) {
            const factoredExtra = data.extra_ids.map((id) => ({
                extra_id: id,
                private_travel_id: result.data.id
            }));
            const privateExtra = await PrivateTravelExtraService.addMany(factoredExtra);
        }
        if (data.status == 'rejected') {
            data.private_travel_id = data.id;
            const cancelNote = await new CancelReservationNoteService(data).add();
        }
        const users = await UserService.getTokenForOnePrivateTravel(data.private_travel_id);
        if (users.length > 0) {
            let title_en = "private travel announcement";
            let content_en = `your private travel from ${users.private_travels[0].going_from} to ${users.private_travels[0].going_to} is ${data.status}`;
            let title_ar = "ما الجديد في رحلاتك";
            let content_ar = `رحلتك الخاصة من ${users.private_travels[0].going_from} الى ${users.private_travels[0].going_to} ` + (data.status == 'rejected')? ' تم رفضها ': ' تم قبولها ';
            sendNotificationsMulticast([users.token], users.language == 'ar' ? title_ar: title_en, users.language == 'ar' ? content_ar: content_en);
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

    changeStatusOfManyPrivateTravel: async (req, res) => {
        const data = req.body;
        const {status, ids, note} = data;
        const result = await PrivateTravelService.changeStatusOfMany(ids, status);
        if (status == 'rejected') {
            if (data.status == 'rejected') {
                const factoredCancelNote = ids.map( (id) => ({
                    note: note,
                    private_travel_id: id,
                }));
                const cancelNotes = await CancelReservationNoteService.addMany(factoredCancelNote);
            }
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllPrivateTravelsDependingOnStatus: async (req, res) => {
        const result = await PrivateTravelService.getAllDependingOnStatus(req.query.status);
        res.status(result.status).send({
            data: result.data,
        });
    },

}

function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}