const { 
    Travel,
    Reservation,
    Line,
    User,
    Bus,
    CancelReservationNote,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class ReservationService {

    constructor(data) {
        this.going_date = data.going_date;
        this.passengers_count = data.passengers_count;
        this.status = data.status;
        this.user_id = data.user_id;
        this.travel_id = data.travel_id;
    }

    async add() {
        try {
            const reservation = await Reservation.create(this);
            return {
                data: reservation,
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
            const reservation = await Reservation.findByPk(data.id);
            reservation.status = data.status || reservation.status;
            reservation.passengers_count = data.passengers_count || reservation.passengers_count;
            reservation.user_id = data.user_id || reservation.user_id;
            reservation.travel_id = data.travel_id || reservation.travel_id;
            reservation.going_date = data.going_date || reservation.going_date;
            await reservation.save();
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
            const deletedReservations = await Reservation.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedReservations > 0) {
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

    static async changeStatusOfMany(ids, status) {
        try {
            const updatedReservations = await Reservation.update({ status: status }, {
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (updatedReservations > 0) {
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

    static async getAllForOneTravel(travel_id) {
        try {
            const reservations = await Reservation.findAll({
                include: [
                    {
                        model: User,
                        as: 'user'
                    },
                    {
                        model: Travel,
                        as: 'travel',
                        include: [
                            {
                                model: Line,
                                as: 'line',
                            }
                        ]
                    },
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
                                as: 'driver'
                            }
                        ]
                    }
                ],
                where: {
                    travel_id: travel_id
                }
            });
            return {
                data: reservations,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneStatus(status) {
        try {
            const reservations = await Reservation.findAll({
                include: [
                    {
                        model: User,
                        as: 'user'
                    },
                    {
                        model: Travel,
                        as: 'travel',
                        include: [
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
                                model: Line,
                                as: 'line',
                            }
                        ]
                    },
                    {
                        model: CancelReservationNote,
                        as: 'cancel_notes'
                    }
                ],
                where: {
                    status: status
                }
            });
            return {
                data: reservations,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllDependingOnStatus(status) {
        try {
            const reservations = await Reservation.findAll({
                include: [
                    {
                        model: User,
                        as: 'user'
                    },
                    {
                        model: Travel,
                        as: 'travel',
                        include: [
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
                                model: Line,
                                as: 'line',
                            },
                        ],
                    },
                    {
                        model: CancelReservationNote,
                        as: 'cancel_notes'
                    }
                ],
                where: {
                    status: status
                }
            });
            return {
                data: reservations,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllMyOld(user_id) {
        try {
            const today = new Date();
            const reservations = await Reservation.findAll({
                include: [
                    {
                        model: CancelReservationNote,
                        as: 'cancel_notes'
                    },
                    {
                        model: Travel,
                        as: 'travel',
                        include: [
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
                                model: Line,
                                as: 'line',
                            },
                        ],
                    },
                ],
                where: {
                    going_date: {
                        [Op.lt]: today
                    },
                    user_id: user_id
                }
            });
            return {
                data: reservations,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllMyFutureDependingOnStatus(user_id, status) {
        try {
            const today = new Date();
            const reservations = await Reservation.findAll({
                include: [
                    {
                        model: CancelReservationNote,
                        as: 'cancel_notes'
                    },
                    {
                        model: Travel,
                        as: 'travel',
                        include: [
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
                                model: Line,
                                as: 'line',
                            },
                        ],
                    },
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
                data: reservations,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllMyFuture(user_id) {
        try {
            const today = new Date();
            const reservations = await Reservation.findAll({
                include: [
                    {
                        model: CancelReservationNote,
                        as: 'cancel_notes'
                    },
                    {
                        model: Travel,
                        as: 'travel',
                        include: [
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
                                model: Line,
                                as: 'line',
                            },
                        ],
                    },
                ],
                where: {
                    going_date: {
                        [Op.gt]: today
                    },
                    user_id: user_id
                }
            });
            return {
                data: reservations,
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
            const reservations = await Reservation.findAll({
                include: [
                    {
                        required: true,
                        model: Travel,
                        as: 'travel',
                        include: [
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
                                            id: user_id
                                        }
                                    }
                                ]
                            },
                            {
                                model: Line,
                                as: 'line',
                            },
                        ],
                    },
                    {
                        model: User,
                        as: 'user',
                    }
                ],
                where: {
                    going_date: {
                        [Op.lt]: today
                    }
                }
            });
            return {
                data: reservations,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllOldForDriverDistinct(user_id) {
        try {
            const today = new Date();
            const reservations = await Reservation.findAll({
                include: [
                    {
                        required: true,
                        model: Travel,
                        as: 'travel',
                        include: [
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
                                            id: user_id
                                        }
                                    }
                                ]
                            },
                            {
                                model: Line,
                                as: 'line',
                            },
                        ],
                    },
                    {
                        model: User,
                        as: 'user',
                    }
                ],
                where: {
                    going_date: {
                        [Op.lt]: today
                    }
                }
            });

            const groupedReservations = reservations.reduce((acc, reservation) => {
                const travelId = reservation.travel.id;
                const goingDate = reservation.going_date.toISOString().split('T')[0];
    
                if (!acc[travelId]) {
                    acc[travelId] = {};
                }
    
                if (!acc[travelId][goingDate]) {
                    acc[travelId][goingDate] = {
                        ...reservation.toJSON(),
                        count: 0,
                        total_passengers_count: 0
                    };
                }

                acc[travelId][goingDate].count++;
                acc[travelId][goingDate].total_passengers_count += reservation.passengers_count;
    
                return acc;
            }, {});
    
            const distinctReservations = []; 
            for (const travelId in groupedReservations) {
                for (const goingDate in groupedReservations[travelId]) {
                    distinctReservations.push(groupedReservations[travelId][goingDate]);
                }
            }
            return {
                data: distinctReservations,
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
            const reservations = await Reservation.findAll({
                include: [
                    {
                        required: true,
                        model: Travel,
                        as: 'travel',
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
                                model: Line,
                                as: 'line',
                            }
                        ],
                    },
                    {
                        model: User,
                        as: 'user',
                    }
                ]
            });
            return {
                data: reservations,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllFutureForDriverDistinct(user_id) {
        try {
            const today = new Date();
            const reservations = await Reservation.findAll({
                include: [
                    {
                        required: true,
                        model: Travel,
                        as: 'travel',
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
                                model: Line,
                                as: 'line',
                            }
                        ],
                    },
                    {
                        model: User,
                        as: 'user',
                    }
                ],
                where: {
                    going_date: {
                        [Op.gt]: today
                    }
                }
            });

            const groupedReservations = reservations.reduce((acc, reservation) => {
                const travelId = reservation.travel.id;
                const goingDate = reservation.going_date.toISOString().split('T')[0];
    
                if (!acc[travelId]) {
                    acc[travelId] = {};
                }
    
                if (!acc[travelId][goingDate]) {
                    acc[travelId][goingDate] = {
                        ...reservation.toJSON(),
                        count: 0,
                        total_passengers_count: 0
                    };
                }

                acc[travelId][goingDate].count++;
                acc[travelId][goingDate].total_passengers_count += reservation.passengers_count;
    
                return acc;
            }, {});
    
            const distinctReservations = []; 
            for (const travelId in groupedReservations) {
                for (const goingDate in groupedReservations[travelId]) {
                    distinctReservations.push(groupedReservations[travelId][goingDate]);
                }
            }
    
            return {
                data: distinctReservations,
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

module.exports = { ReservationService };