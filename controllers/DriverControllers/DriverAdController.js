const { DriverAdService } = require('../../services/DriverAdService');


module.exports = {

    addAds: async (req, res) => {
        const data = req.body;
        data.driver_id = req.user.id;
        const result = await new DriverAdService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    editAdd: async (req, res) => {
        const data = req.body;
        data.driver_id = req.user.id;
        data.id = req.params.add_id;
        const add = await DriverAdService.getById(req.params.add_id, data.driver_id);
        if (add.data?.id) {
            const result = await DriverAdService.edit(data);
            res.status(result.status).send({
                data: result.data,
            });
        } else {
            res.status(400).send({
                data: 'this is not your add',
            });
        }
    },

    getAllMyAds: async (req, res) => {
        const result = await DriverAdService.getAllMine(req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteManyAdds: async (req, res) => {
        const result = await DriverAdService.delete(req.body.ids, req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllDriversAds: async (req, res) => {
        const result = await DriverAdService.getAllWithoutMe(req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

}