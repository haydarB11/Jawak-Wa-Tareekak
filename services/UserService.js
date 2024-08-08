const { 
    User,
    PrivateTravel,
    DriverHoliday,
    Bus,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class UserService {

    constructor(data) {
        this.full_name = data.full_name;
        this.phone = data.phone;
        this.password = data.password;
        this.type = data.type;
        this.token = data.token;
        this.commission_limit = data.commission_limit;
        this.payment = data.payment;
        this.is_verified = data.is_verified;
        this.language = data.language;
        this.is_activated = data.is_activated;
    }

    async add() {
        try {
            const user = await User.create(this);
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                console.log(error.errors);
                return {
                    data: error.errors.map((err) => {
                        return {
                            name: err.path,
                            message: err.message
                        }
                    }),
                    status: httpStatus.BAD_REQUEST
                }
            } else {
                return {
                    data: error,
                    status: httpStatus.BAD_REQUEST
                };
            }
        }
    }

    static async getAll() {
        try {
            const user = await User.findAll({
                where: {
                    type: {
                        [Op.ne]: "manager"
                    },
                    is_verified: true,
                    is_activated: true
                }
            });
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getForOnePrivateTravel(private_travel_id) {
        try {
            const user = await User.findOne({
                include: [
                    {
                        required: true,
                        model: PrivateTravel,
                        as: 'private_travels',
                        where: {
                            id: private_travel_id
                        }
                    }
                ]
            });
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneType(type) {
        try {
            const user = await User.findAll({
                include: [
                    {
                        model: Bus,
                        as: 'bus'
                    }
                ],
                where: {
                    type: {
                        [Op.eq]: type,
                    },
                    is_verified: true,
                    is_activated: true
                }
            });
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForSpecificTypes(types) {
        try {
            const user = await User.findAll({
                where: {
                    type: {
                        [Op.in]: types,
                    },
                    token: {[Op.ne]: null},
                    is_verified: true,
                    is_activated: true
                }
            });
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForManyTypes(types) {
        try {
            const user = await User.findAll({
                include: [
                    {
                        model: Bus,
                        as: 'bus'
                    }
                ],
                where: {
                    type: {
                        [Op.in]: types,
                    },
                    is_verified: true,
                    is_activated: true
                }
            });
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllTrackersForOneTravel(private_travel_id) {
        try {
            const users = await User.findAll({
                include: [
                    {
                        required: true,
                        model: TrackingUser,
                        as: 'tracking_users',
                        where: {
                            private_travel_id: private_travel_id
                        }
                    }
                ]
            });
            const ids = users.map(user => user.id);
            return {
                data: ids,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllUnAccepted() {
        try {
            const user = await User.findAll({
                include: [
                    {
                        model: Bus,
                        as: 'bus'
                    }
                ],
                where: {
                    is_activated: false,
                    type: 'driver'
                }
            });
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getById(id) {
        try {
            const user = await User.findOne({
                include: [
                    {
                        model: Bus,
                        as: 'bus'
                    }
                ],
                where: {
                    id: id
                }
            });
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllAvailableDriversInOneDate(date) {
        try {
            const date1 = new Date(date)
            const user = await User.findAll({
                include: [
                    {
                        model: Bus,
                        as: 'bus'
                    },
                    {
                        required: false,
                        model: DriverHoliday,
                        as: 'driver_holidays',
                        where: {
                            date: {
                                [Op.eq]: date1
                            }
                        }
                    },
                ],
                where: {
                    type: {
                        [Op.in]: ['driver', 'super_driver'],
                    },
                    is_activated: true,
                    is_verified: true
                }
            });
            console.log(user);
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getByPhone(phone) {
        try {
            const user = await User.findOne({
                where: {
                    phone: phone
                }
            });
            return {
                data: user,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async managerLogin(data) {
        try {
            const user = await User.findOne({
                where: {
                    phone: data.phone,
                }
            });
            if (!user || user.type === "user" || user?.type === "driver" || user?.type === "super_driver") {
                return {
                    data: 'phone Not Found',
                    status: httpStatus.NOT_FOUND
                };
            } else if (data.password !== user.password) {
                return {
                    data: 'Invalid password',
                    status: httpStatus.NOT_FOUND
                };
            } else {
                return {
                    data: {
                        token: user.generateToken(),
                        data: user
                    },
                    status: httpStatus.OK
                };
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async userLogin(data) {
        try {
            const user = await User.findOne({
                where: {
                    phone: data.phone,
                }
            });
            if (!user || user?.type === "manager" || user?.type === "supervisor" || user?.type === "driver" || user?.type === "super_driver") {
                return {
                    data: 'User Not Found',
                    status: httpStatus.NOT_FOUND
                };
            } else if (data.password !== user.password) {
                return {
                    data: 'Invalid password',
                    status: httpStatus.NOT_FOUND
                }
            } else if (user.is_verified == false) {
                return {
                    data: 'un verified user',
                    status: httpStatus.NOT_FOUND
                }
            } else {
                return {
                    data: {
                        token: user.generateToken(),
                        data: user
                    },
                    status: httpStatus.OK
                }
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async driverLogin(data) {
        try {
            const user = await User.findOne({
                where: {
                    phone: data.phone,
                }
            });
            if (!user || user?.type === "manager" || user?.type === "supervisor" || user?.type === "user") {
                return {
                    data: 'User Not Found',
                    status: httpStatus.NOT_FOUND
                };
            } else if (data.password !== user.password) {
                return {
                    data: 'Invalid password',
                    status: httpStatus.NOT_FOUND
                }
            } else if (user.is_verified == false) {
                return {
                    data: 'un verified driver',
                    status: httpStatus.NOT_FOUND
                }
            } else if (user.is_accepted == false) {
                return {
                    data: 'un accepted driver',
                    status: httpStatus.NOT_FOUND
                }
            } else {
                return {
                    data: {
                        token: user.generateToken(),
                        data: user
                    },
                    status: httpStatus.OK
                }
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async edit(data) {
        try {
            const user = await User.findByPk(+data.id);
            user.full_name = data.full_name || user.full_name;
            user.phone = data.phone || user.phone;
            user.password = data.password || user.password;
            user.language = data.language || user.language;
            user.commission_limit = data.commission_limit || user.commission_limit;
            user.payment = data.payment || user.payment;
            user.token = data.token || user.token;
            user.is_verified = data.is_verified || user.is_verified;
            if (data.is_activated == true || data.is_activated == false || data.is_activated == 1 || data.is_activated == 0) { 
                user.is_activated = data.is_activated;
            }
            await user.save();
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

    static async editByPhone(data) {
        try {
            const user = await User.findOne({
                where: {
                    phone: data.phone
                }
            });
            user.full_name = data.full_name || user.full_name;
            user.phone = data.phone || user.phone;
            user.password = data.password || user.password;
            user.language = data.language || user.language;
            user.token = data.token || user.token;
            user.is_verified = data.is_verified || user.is_verified;
            if (data.is_activated == true || data.is_activated == false) { 
                user.is_activated = data.is_activated;
            }
            await user.save();
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
            const user = await User.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (user >= 1) {
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

    static async getTokenFromDataBase() {
        try {
            let tokens = await User.findAll({
                attributes: ['token'],
                where: {
                    token: {
                        [Op.not]: null
                    },
                    is_verified: true,
                    is_activated: true
                }
            });
            tokens = tokens.map(item => item.token);
            return tokens;
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getTokenFromDataBaseForSpecificTypesOfUsers(types) {
        try {
            let tokens = await User.findAll({
                attributes: ['token'],
                where: {
                    token: {
                        [Op.not]: null
                    },
                    is_verified: true,
                    is_activated: true,
                    type: {
                        [Op.in]: types
                    }
                }
            });
            tokens = tokens.map(item => item.token);
            return tokens;
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getTokenForOnePrivateTravel(private_travel_id) {
        try {
            let tokens = await User.findOne({
                include: [
                    {
                        required: true,
                        model: PrivateTravel,
                        as: 'private_travels',
                        where: {
                            id: private_travel_id
                        }
                    }
                ],
                where: {
                    token: {
                        [Op.not]: null
                    },
                }
            });
            return tokens;
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getTokenForOneUser(user_id) {
        try {
            let tokens = await User.findAll({
                attributes: ['token'],
                where: {
                    token: {
                        [Op.not]: null
                    },
                    id: user_id
                }
            });
            tokens = tokens.map(item => item.token);
            return tokens;
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async splitTokens(tokens, chunkSize) {
        const chunks = [];
        let i = 0;
        while (i < tokens.length) {
            chunks.push(tokens.slice(i, (i += chunkSize)));
        }
        return chunks;
    }

    static generateOTP() {
        let digits = '0123456789'; 
        let OTP = ''; 
        let len = digits.length 
        for (let i = 0; i < 5; i++) { 
            OTP += digits[Math.floor(Math.random() * len)]; 
        } 
        return OTP; 
    } 

}

module.exports = { UserService };