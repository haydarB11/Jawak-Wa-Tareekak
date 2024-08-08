const { ExtraService } = require('../../services/ExtraService');


module.exports = {

    getAllExtras: async (req, res) => {
        const result = await ExtraService.getAllForOneLanguage(req.query.language);
        res.status(result.status).send({
            data: result.data,
        });
    },

}