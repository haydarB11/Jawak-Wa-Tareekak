const { 
    PrivateTravel,
    Bus,
    User,
    CancelReservationNote,
    ReservationExtra,
    Extra,
    sequelize
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class PrivateTravelService {

    constructor(data) {
        this.going_from = data.going_from;
        this.going_to = data.going_to;
        this.going_date = data.going_date;
        this.status = data.status;
        this.seats = data.seats;
        this.lat = data.lat;
        this.lon = data.lon;
        this.lat_back = data.lat_back;
        this.lon_back = data.lon_back;
        this.user_id = data.user_id;
        this.code = data.code;
        this.bus_id = data.bus_id;
        this.price = data.price;
        this.is_redirected = data.is_redirected;
    }

    async add() {
        try {
            const privateTravel = await PrivateTravel.create(this);
            return {
                data: privateTravel,
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
            const privateTravel = await PrivateTravel.findByPk(data.id);
            privateTravel.going_date = data.going_date || privateTravel.going_date;
            privateTravel.going_from = data.going_from || privateTravel.going_from;
            privateTravel.going_to = data.going_to || privateTravel.going_to;
            privateTravel.going_date = data.going_date || privateTravel.going_date;
            privateTravel.status = data.status || privateTravel.status;
            privateTravel.seats = data.seats || privateTravel.seats;
            privateTravel.lat = data.lat || privateTravel.lat;
            privateTravel.lon = data.lon || privateTravel.lon;
            privateTravel.lat_back = data.lat_back || privateTravel.lat_back;
            privateTravel.lon_back = data.lon_back || privateTravel.lon_back;
            privateTravel.bus_id = data.bus_id || privateTravel.bus_id;
            privateTravel.code = data.code || privateTravel.code;
            privateTravel.price = data.price || privateTravel.price;
            privateTravel.is_redirected = data.is_redirected || privateTravel.is_redirected;
            privateTravel.from_driver_id = data.from_driver_id || privateTravel.from_driver_id;
            await privateTravel.save();
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

    static async changeStatusOfMany(ids, status) {
        try {
            const updatedPrivateTravels = await PrivateTravel.update({ status: status }, {
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (updatedPrivateTravels > 0) {
                return { 
                    data: 'updated',
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

    static async delete(ids) {
        try {
            const deletedPrivateTravel = await PrivateTravel.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedPrivateTravel > 0) {
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

    static async getAllDependingOnStatus(status) {
        try {
            const privateTravel = await PrivateTravel.findAll({
                include: [
                    {
                        model: User,
                        as: 'user'
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
                    },
                    {
                        model: CancelReservationNote,
                        as: 'cancel_notes'
                    },
                    {
                        model: ReservationExtra,
                        as: 'reservation_extra',
                        include: [
                            {
                                model: Extra,
                                as: 'extra'
                            }
                        ]
                    }
                ],
                where: {
                    status: status
                }
            });
            return {
                data: privateTravel,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getDependingOnCode(code) {
        try {
            const privateTravel = await PrivateTravel.findOne({
                where: {
                    code: code
                },
                order: [['id', 'DESC']]
            });
            return {
                data: privateTravel,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllMyOld(user_id, language = 'ar') {
        try {
            const today = new Date();
            const title = language === 'ar' ? 'title_ar' : 'title_en';
            const privateTravel = await PrivateTravel.findAll({
                include: [
                    {
                        model: CancelReservationNote,
                        as: 'cancel_notes',
                    },
                    {
                        model: Bus,
                        as: 'bus',
                        include: [
                            {
                                model: User,
                                as: 'driver',
                            }
                        ]
                    },
                    {
                        model: ReservationExtra,
                        as: 'reservation_extra',
                        include: [
                            {
                                attributes: [
                                    [sequelize.col(title), 'title'],
                                    'price',
                                    'id'
                                ],
                                model: Extra,
                                as: 'extra'
                            }
                        ]
                    }
                ],
                where: {
                    going_date: {
                        [Op.lt]: today,
                    },
                    user_id: user_id
                }
            });
            return {
                data: privateTravel,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllMyFutureDependingOnStatus(user_id, status, language = 'ar') {
        try {
            const today = new Date();
            const title = language === 'ar' ? 'title_ar' : 'title_en';
            const privateTravel = await PrivateTravel.findAll({
                include: [
                    {
                        model: CancelReservationNote,
                        as: 'cancel_notes'
                    },
                    {
                        model: Bus,
                        as: 'bus',
                        include: [
                            {
                                model: User,
                                as: 'driver',
                            }
                        ]
                    },
                    {
                        model: ReservationExtra,
                        as: 'reservation_extra',
                        include: [
                            {
                                attributes: [
                                    [sequelize.col(title), 'title'],
                                    'price',
                                    'id'
                                ],
                                model: Extra,
                                as: 'extra'
                            }
                        ]
                    }
                ],
                where: {
                    going_date: {
                        [Op.gt]: today
                    },
                    status: status,
                    user_id: user_id
                }
            });
            return {
                data: privateTravel,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllMyFutureDependingOnStatusForDriver(driver_id, status, language = 'ar') {
        try {
            const today = new Date();
            const title = language === 'ar' ? 'title_ar' : 'title_en';
            const privateTravel = await PrivateTravel.findAll({
                include: [
                    {
                        model: CancelReservationNote,
                        as: 'cancel_notes'
                    },
                    {
                        required: true,
                        model: Bus,
                        as: 'bus',
                        include: [
                            {
                                required: true,
                                model: User,
                                as: 'driver',
                                where: {
                                    id: driver_id
                                }
                            }
                        ]
                    },
                    {
                        model: ReservationExtra,
                        as: 'reservation_extra',
                        include: [
                            {
                                attributes: [
                                    [sequelize.col(title), 'title'],
                                    'price',
                                    'id'
                                ],
                                model: Extra,
                                as: 'extra'
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'user'
                    }
                ],
                where: {
                    going_date: {
                        [Op.gt]: today
                    },
                    status: status,
                }
            });
            return {
                data: privateTravel,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllMyFuture(user_id, language = 'ar') {
        try {
            const today = new Date();
            const title = language === 'ar' ? 'title_ar' : 'title_en';
            const privateTravel = await PrivateTravel.findAll({
                include: [
                    {
                        model: CancelReservationNote,
                        as: 'cancel_notes'
                    },
                    {
                        model: Bus,
                        as: 'bus',
                        include: [
                            {
                                model: User,
                                as: 'driver',
                            }
                        ]
                    },
                    {
                        model: ReservationExtra,
                        as: 'reservation_extra',
                        include: [
                            {
                                attributes: [
                                    [sequelize.col(title), 'title'],
                                    'price',
                                    'id'
                                ],
                                model: Extra,
                                as: 'extra'
                            }
                        ]
                    }
                ],
                where: {
                    going_date: {
                        [Op.gt]: today
                    },
                    user_id: user_id
                }
            });
            return {
                data: privateTravel,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllOldForDriver(user_id) {
        try {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const privateTravel = await PrivateTravel.findAll({
                include: [
                    {
                        attributes: [],
                        required: true,
                        model: Bus,
                        as: 'bus',
                        include: [
                            {
                                attributes: [],
                                required: true,
                                model: User,
                                as: 'driver',
                                where: {
                                    id: user_id
                                }
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'user'
                    }
                ],
                where: {
                    going_date: {
                        [Op.lt]: yesterday
                    }
                }
            });
            return {
                data: privateTravel,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllFuturePendingWithoutDriver(language = 'ar') {
        try {
            const today = new Date();
            const privateTravel = await PrivateTravel.findAll({
                include: [
                    {
                        model: ReservationExtra,
                        as: 'reservation_extra',
                        include: [
                            {
                                attributes: [
                                    'id',
                                    [sequelize.col(`title_${language}`), 'title'],
                                    'price',
                                ],
                                model: Extra,
                                as: 'extra',
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'user'
                    }
                ],
                where: {
                    going_date: {
                        [Op.gte]: today
                    },
                    status: 'pending',
                    bus_id: null
                }
            });
            return {
                data: privateTravel,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllFutureForDriver(user_id) {
        try {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const privateTravel = await PrivateTravel.findAll({
                include: [
                    {
                        attributes: [],
                        required: true,
                        model: Bus,
                        as: 'bus',
                        include: [
                            {
                                attributes: [],
                                required: true,
                                model: User,
                                as: 'driver',
                                where: {
                                    id: user_id
                                }
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'user',
                    }
                ],
                where: {
                    going_date: {
                        [Op.gt]: yesterday
                    },
                    status: 'accepted'
                }
            });
            return {
                data: privateTravel,
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

module.exports = { PrivateTravelService };