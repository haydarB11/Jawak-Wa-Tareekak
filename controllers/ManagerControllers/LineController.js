const { LineService } = require('../../services/LineService');

module.exports = {

    addLine: async (req, res) => {
        const data = req.body;
        const oldLine = await LineService.getByName(data);
        if (oldLine.data?.id) {
            return res.status(400).send({
                data: 'you add this line before',
            });
        }
        const result = await new LineService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteLine: async (req, res) => {
        const result = await LineService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editLine: async (req, res) => {
        const data = req.body;
        data.id = req.params.line_id;
        const result = await LineService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllLines: async (req, res) => {
        const result = await LineService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

}