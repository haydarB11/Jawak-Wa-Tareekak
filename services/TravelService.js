const { 
    Travel,
    User,
    Line,
    Bus,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class TravelService {

    constructor(data) {
        this.starting_date = data.starting_date;
        this.ending_date = data.ending_date;
        this.going_from = data.going_from;
        this.returning_from = data.returning_from;
        this.going_time = data.going_time;
        this.returning_time = data.returning_time;
        this.starting_pool = data.starting_pool;
        this.returning_pool = data.returning_pool;
        this.type = data.type;
        this.price = data.price;
        this.status = data.status;
        this.line_id = data.line_id;
        this.bus_id = data.bus_id;
    }

    async add() {
        try {
            const travel = await Travel.create(this);
            return {
                data: travel,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async edit(data) {
        try {
            const travel = await Travel.findByPk(data.id);
            travel.starting_date = data.starting_date || travel.starting_date;
            travel.ending_date = data.ending_date || travel.ending_date;
            travel.going_from = data.going_from || travel.going_from;
            travel.returning_from = data.returning_from || travel.returning_from;
            travel.going_date = data.going_date || travel.going_date;
            travel.returning_date = data.returning_date || travel.returning_date;
            travel.starting_pool = data.starting_pool || travel.starting_pool;
            travel.returning_pool = data.returning_pool || travel.returning_pool;
            travel.type = data.type || travel.type;
            travel.status = data.status || travel.status;
            travel.line_id = data.line_id || travel.line_id;
            travel.bus_id = data.bus_id || travel.bus_id;
            travel.price = data.price || travel.price;
            await travel.save();
            return {
                data: 'updated',
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async delete(ids) {
        try {
            const deletedTravels = await Travel.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedTravels > 0) {
                return {
                    data: 'deleted',
                    status: httpStatus.OK
                };
            } else {
                return {
                    data: 'something went wrong',
                    status: httpStatus.BAD_REQUEST
                };
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAll() {
        try {
            const travels = await Travel.findAll({
                include: [
                    {
                        model: Line,
                        as: 'line'
                    },
                    {
                        model: Bus,
                        as: 'bus',
                        include: [
                            {
                                model: User,
                                as: 'driver'
                            }
                        ]
                    }
                ]
            });
            return {
                data: travels,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneLine(line_id) {
        try {
            const travels = await Travel.findAll({
                include: [
                    {
                        model: Line,
                        as: 'line'
                    },
                    {
                        model: Bus,
                        as: 'bus',
                        include: [
                            {
                                model: User,
                                as: 'driver'
                            }
                        ]
                    }
                ],
                where: {
                    line_id:line_id
                }
            });
            return {
                data: travels,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

}

module.exports = { TravelService };