const { DriverHolidayService } = require('../../services/DriverHolidayService');


module.exports = {

    addDriverHolidays: async (req, res) => {
        const { dates } = req.body;
        const { driver_id } = req.params;
        const factoredHolidayData = dates.map(date => ({
            driver_id: driver_id,
            date: date
        }))
        await DriverHolidayService.deleteAllFutureForOneDriver(driver_id);
        const result = await DriverHolidayService.addMany(factoredHolidayData);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllDriverHolidays: async (req, res) => {
        const result = await DriverHolidayService.getAllForOneDriver(req.params.driver_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    deleteManyDriverHolidays: async (req, res) => {
        const result = await DriverHolidayService.delete(req.body.ids);
        res.status(result.status).send({
            data: result.data,
        });
    },

}