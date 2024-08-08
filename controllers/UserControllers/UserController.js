const { UserService } = require('../../services/UserService');
const { OtpService } = require('../../services/OtpService');


module.exports = {

    userRegister: async (req, res) => {
        const data = req.body;
        data.is_activated = true;
        const result = await new UserService(data).add();
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
        if (req.body.code == '00000') {
            await UserService.editByPhone({ is_verified: true, phone: data.phone });
            const user = await UserService.getByPhone(data.phone);
            const login = await UserService.userLogin({phone: data.phone, password: user.data.password});
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
        const result = await UserService.userLogin(req.body);
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
            const result = await UserService.edit(data);
            res.status(result.status).send({
                data: result.data,
            }); 
        }
    },

    resetPassword: async (req, res) => {
        const { new_password, confirm } = req.body;
        if ( new_password === confirm) {
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

    getAllAvailableDrivers: async (req, res) => {
        const result = await UserService.getAllAvailableDriversInOneDate(req.query.date);
        let data;
        console.log(result.data);
        if (Array.isArray(result.data) && result.data.length > 0) {
            data = result.data.filter(driver => driver.driver_holidays.length === 0 );
        }
        res.status(result.status).send({
            data: data,
        });
    },

    getAuth: async (req, res) => {
        const result = await UserService.getById(req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

}