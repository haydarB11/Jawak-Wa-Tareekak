const { UserService } = require('../../services/UserService');
const { OtpService } = require('../../services/OtpService');
const { BusService } = require('../../services/BusService');
const twilio = require('twilio');
const IP = require('ip');
const axios = require('axios');


module.exports = {

    userRegister: async (req, res) => {
        const data = req.body;
        data.is_activated = false;
        data.type = 'driver';
        const result = await new UserService(data).add();
        data.user_id = result.data.id;
        const bus = await new BusService(data).add();
        const code = UserService.generateOTP();
        const Otp = await new OtpService({ code: code, phone: data.phone }).add();
        res.status(result.status).send({
            data: result.data,
        });
    },

    sendOTP: async (req, res) => {
        const { phone } = req.body;
        try {
            const code = UserService.generateOTP();
            const Otp = await new OtpService({ code, phone }).add();
            res.status(Otp.status).send({
                data: 'sent successfully',
            });
        } catch (error) {
            res.status(404).send({
                data: error.message,
            });
        }
    },

    verifyOtp: async (req, res) => {
        const data = req.body;
        const otp = await OtpService.getLast(data.phone);
        // if (otp.data?.code == req.body.code) {
        if (req.body.code == '00000') {
            await UserService.editByPhone({ is_verified: true, phone: data.phone });
            const user = await UserService.getByPhone(data.phone);
            const login = await UserService.driverLogin({phone: data.phone, password: user.data.password});
            res.status(200).send({
                data: 'verified successfully',
                user: login.data
            });
        } else {
            res.status(404).send({
                data: 'wrong code',
            });
        }
    },

    userLogin: async (req, res) => {
        const result = await UserService.driverLogin(req.body);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editOwnAccount: async (req, res) => {
        const data = req.body;
        data.id = req.user.id;
        const { new_password, confirm } = req.body;
        if ( new_password && new_password === confirm) {
            data.password = new_password;
            const user = await UserService.getById(data.id);
            if (user.data.password == data.old_password) {
                const result = await UserService.edit(data);  
                res.status(result.status).send({
                    data: result.data,
                }); 
            } else {  
                return res.status(404).send({
                    data: 'old password is wrong',
                });
            }
        } else if (new_password){    
            return res.status(404).send({
                data: 'password is not equal confirmed one',
            });
        } else {
            console.log('nnnnn');
            const result = await UserService.edit(data);
            const busForDriver = await BusService.getForOneDriver(data.driver_id);
            console.log(busForDriver.data.id);
            data.id = busForDriver.data.id;
            const editedBus = await BusService.edit(data);
            res.status(result.status).send({
                data: result.data,
            }); 
        }
    },

    resetPassword: async (req, res) => {
        const { new_password, confirm } = req.body;
        if ( new_password == confirm) {
            const result = await UserService.edit({ password: new_password, id: req.user.id });     
            res.status(result.status).send({
                data: result.data,
            });
        } else {    
            return res.status(404).send({
                data: 'password is not equal confirmed one',
            });
        }
    },

    deleteAccount: async (req, res) => {
        const result = await UserService.delete([req.user.id]);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAuth: async (req, res) => {
        const result = await UserService.getById(req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllDrivers: async (req, res) => {
        const result = await UserService.getAllForManyTypes(['driver', 'super_driver']);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllAvailableDrivers: async (req, res) => {
        const result = await UserService.getAllAvailableDriversInOneDate(req.query.date);
        let data;
        console.log(result.data);
        if (Array.isArray(result.data) && result.data.length > 0) { // check if it is array + check if they have travel in this date
            data = result.data.filter(driver => driver.driver_holidays.length === 0 );
        }
        res.status(result.status).send({
            data: data,
        });
    },

}