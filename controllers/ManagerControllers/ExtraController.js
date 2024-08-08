const { ExtraService } = require('../../services/ExtraService');


module.exports = {

    addExtra: async (req, res) => {
        const data = req.body;
        const result = await new ExtraService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteExtra: async (req, res) => {
        const result = await ExtraService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editExtra: async (req, res) => {
        const data = req.body;
        data.id = req.params.extra_id;
        const result = await ExtraService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllExtras: async (req, res) => {
        const result = await ExtraService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

}