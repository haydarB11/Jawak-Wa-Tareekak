const { BusService } = require('../../services/BusService');


module.exports = {

    editBus: async (req, res) => {
        const data = req.body;
        data.id = req.params.bus_id;
        const result = await BusService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

}