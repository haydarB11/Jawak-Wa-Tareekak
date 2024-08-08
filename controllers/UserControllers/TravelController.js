const { TravelService } = require('../../services/TravelService');


module.exports = {

    getAllAvailableTravelsForOneLines: async (req, res) => {
        const result = await TravelService.getAllForOneLine(req.params.line_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

}