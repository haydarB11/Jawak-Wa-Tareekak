const { PrivateTravelService } = require('../../services/PrivateTravelService');
const { ReservationService } = require('../../services/ReservationService');
const { TravelService } = require('../../services/TravelService');
const sendNotificationsMulticast = require('../../utils/notification/notification');

module.exports = {

    addTravel: async (req, res) => {
        const data = req.body;
        const result = await new TravelService(data).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteTravel: async (req, res) => {
        const result = await TravelService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editTravel: async (req, res) => {
        const data = req.body;
        data.id = req.params.travel_id;
        const result = await TravelService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllTravels: async (req, res) => {
        const result = await TravelService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllTravelsForOneLine: async (req, res) => {
        const result = await TravelService.getAllForOneLine(req.params.line_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllFutureTravelsForOneDriver: async (req, res) => {
        const result1 = await PrivateTravelService.getAllFutureForDriver(req.params.driver_id);
        const data1 = result1.data.map(data => ({
            ...data.toJSON(),
            type: 'private'
        }))
        const result2 = await ReservationService.getAllFutureForDriver(req.params.driver_id);
        const data2 = result2.data.map(data => ({
            ...data.toJSON(),
            type: 'public'
        }))
        const result = [ ...data1, ...data2 ].sort((a, b) => {
            
            if (a.going_date < b.going_date) return -1;
            if (a.going_date > b.going_date) return 1;
        
            return 0;
        });
        res.status(result2.status).send({
            data: result,
        });
    },

    getAllOldTravelsForOneDriver: async (req, res) => {
        const result1 = await PrivateTravelService.getAllOldForDriver(req.params.driver_id);
        const data1 = result1.data.map(data => ({
            ...data.toJSON(),
            type: 'private'
        }))
        const result2 = await ReservationService.getAllOldForDriver(req.params.driver_id);
        console.log(result2);
        const data2 = result2.data.map(data => ({
            ...data.toJSON(),
            type: 'public'
        }))
        const result = [ ...data1, ...data2 ].sort((a, b) => {

            if (a.going_date < b.going_date) return 1;
            if (a.going_date > b.going_date) return -1;
        
            return 0;
        });
        res.status(result2.status).send({
            data: result,
        });
    },

}