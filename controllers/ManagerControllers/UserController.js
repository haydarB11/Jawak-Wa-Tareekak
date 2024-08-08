const { BusService } = require('../../services/BusService');
const { UserService } = require('../../services/UserService');


module.exports = {

    addUser: async (req, res) => {
        const data = req.body;
        data.is_verified = true;
        data.is_activated = true;
        const result = await new UserService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    addDriver: async (req, res) => {
        const data = req.body;
        data.is_verified = true;
        data.is_activated = true;
        data.type = 'driver';
        const result = await new UserService(data).add();
        data.user_id = result.data.id;
        const bus = await new BusService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    managerLogin: async (req, res) => {
        const result = await UserService.managerLogin(req.body);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editUser: async (req, res) => {
        const data = req.body;
        data.id = req.params.user_id;
        const result = await UserService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getMyOwnAccount: async (req, res) => {
        const result = await UserService.getById(req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteUser: async (req, res) => {
        const result = await UserService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllUsers: async (req, res) => {
        const result = await UserService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllUsersDependingOnType: async (req, res) => {
        const result = await UserService.getAllForOneType(req.query.type);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllUnAcceptedDrivers: async (req, res) => {
        const result = await UserService.getAllUnAccepted();
        res.status(result.status).send({
            data: result.data,
        });
    },

    editOwnAccount: async (req, res) => {
        const data = req.body;
        data.id = req.user.id;
        const result = await UserService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

}