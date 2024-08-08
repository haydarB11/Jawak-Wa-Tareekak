const { 
    Line,
    User,
    Travel,
    sequelize
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class LineService {

    constructor(data) {
        this.point_a = data.point_a;
        this.point_b = data.point_b;
    }

    async add() {
        try {
            const line = await Line.create(this);
            return {
                data: line,
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
            const line = await Line.findByPk(data.id);
            line.point_a = data.point_a || line.point_a;
            line.point_b = data.point_b || line.point_b;
            await line.save();
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
            const deletedLines = await Line.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedLines > 0) {
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
            const lines = await Line.findAll({});
            return {
                data: lines,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getByName(data) {
        try {
            const line = await Line.findOne({
                where: {
                    [Op.or]: [
                        {
                            point_a: data.point_a,
                            point_b: data.point_b
                        },
                        {
                            point_a: data.point_b,
                            point_b: data.point_a
                        }
                    ]
                }
            });
            return {
                data: line,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    // make conditions true
    static async getAllWithTravelsInIt() {
        try {
            const today = new Date();
            const lines = await Line.findAll({
                include: [
                    {
                        attributes: [],
                        model: Travel,
                        as: 'travels',
                        where: {
                            starting_date: {
                                [Op.lte]: today
                            },
                            ending_date: {
                                [Op.or]: [
                                    {
                                        [Op.gt]: today
                                    },
                                    {
                                        [Op.and]: [
                                            {
                                                [Op.eq]: today
                                            },
                                            {
                                                starting_trip: {
                                                    [Op.gt]: today.getTime()
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ]
            });
            return {
                data: lines,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneLanguage(language) {
        try {
            const advertisements = await Line.findAll({
                where: {
                    is_show: true
                }
            });
            return {
                data: advertisements,
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

module.exports = { LineService };