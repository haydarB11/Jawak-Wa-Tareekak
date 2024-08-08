const { ReservationService } = require('../../services/ReservationService');

module.exports = {

    addReservation: async (req, res) => {
        const data = req.body;
        const result = await new ReservationService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

}