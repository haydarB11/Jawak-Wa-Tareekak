const { LineService } = require('../../services/LineService');


module.exports = {

    getAllLines: async (req, res) => {
        const result = await LineService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

}