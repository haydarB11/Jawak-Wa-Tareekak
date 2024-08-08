const { BusService } = require('../../services/BusService');
const { CancelReservationNoteService } = require('../../services/CancelReservationNote');
const { NotificationService } = require('../../services/NotificationService');
const { NotificationUserService } = require('../../services/NotificationUserService');
const { PrivateTravelExtraService } = require('../../services/PrivateTravelExtraService');
const { PrivateTravelService } = require('../../services/PrivateTravelService');
const { ReservationService } = require('../../services/ReservationService');
const { UserService } = require('../../services/UserService');
const { StaticContentService } = require('../../services/StaticContentService');
const sendNotificationsMulticast = require('../../utils/notification/notification');

        
function generateOTP() {
    let digits = '0123456789'; 
    let OTP = ''; 
    let len = digits.length 
    for (let i = 0; i < 5; i++) { 
        OTP += digits[Math.floor(Math.random() * len)]; 
    } 
    return OTP; 
} 


module.exports = {

    getAllMyFutureTravels: async (req, res) => {
        const result1 = await PrivateTravelService.getAllFutureForDriver(req.user.id);
        const data1 = result1.data.map(data => ({
            ...data.toJSON(),
            type: 'private'
        }))
        // console.log(data1);
        const result2 = await ReservationService.getAllFutureForDriverDistinct(req.user.id);
        const data2 = result2.data.map(data => ({
            ...data,
            // ...data.toJSON(),
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

    getAllMyOldTravels: async (req, res) => {
        const result1 = await PrivateTravelService.getAllOldForDriver(req.user.id);
        const data1 = result1.data.map(data => ({
            ...data.toJSON(),
            type: 'private'
        }))
        const result2 = await ReservationService.getAllOldForDriverDistinct(req.user.id);
        const data2 = result2.data.map(data => ({
            ...data,
            // ...data.toJSON(),
            type: 'public'
        }));
        const result = [ ...data1, ...data2 ].sort((a, b) => {

            if (a.going_date < b.going_date) return 1;
            if (a.going_date > b.going_date) return -1;
        
            return 0;
        });
        res.status(result2.status).send({
            data: result,
        });
    },

    addPrivateTravelReservation: async (req, res) => {
        const data = req.body;
        data.user_id = req.user.id;
        if (data.driver_id) {
            const bus = await BusService.getForOneDriver(data.driver_id);
            data.bus_id = bus.data.id;
            data.status = 'accepted';
            data.is_redirected = true;
        } else {
            data.status = 'pending';
            data.is_redirected = true;
            // return res.status(400).send({
            //     data: 'driver id is required',
            // });
        }
        const result = await new PrivateTravelService(data).add();
        // new test
        if (data.driver_id) {
            const user = await UserService.getById(data.driver_id);
            const commission = await StaticContentService.getDependingOnTitle('commission');
            await UserService.edit({id: data.driver_id, payment: ( data.price * (commission.data?.content_ar || 0) ) + user.data.payment});
        }
        if (data.extra_ids) {
            const factoredExtra = data.extra_ids.map((id) => ({
                extra_id: id,
                private_travel_id: result.data.id
            }));
            const privateExtra = await PrivateTravelExtraService.addMany(factoredExtra);
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

    // or getting from user waiting driver to accept it
    getAllFuturePendingWithoutDriverPrivateTravel: async (req, res) => {
        const result = await PrivateTravelService.getAllFuturePendingWithoutDriver(req.query?.language);
        const pendingWithDriver = await PrivateTravelService.getAllMyFutureDependingOnStatusForDriver(req.user.id, 'pending', req.query?.language);
        const data = [ ...result.data, ...pendingWithDriver.data];
        res.status(result.status).send({
            data: data,
        });
    },

    takePrivateTravel: async (req, res) => {
        const data = req.body;
        data.driver_id = req.user.id;
        const bus = await BusService.getForOneDriver(data.driver_id);
        data.bus_id = bus.data.id;
        data.status = 'accepted';
        data.id = req.params.private_travel_id;
        data.code = generateOTP();
        const result = await PrivateTravelService.edit(data);

        const user = await UserService.getForOnePrivateTravel(data.id);
        // new 
        if (data.driver_id) {
            const user = await UserService.getById(data.driver_id);
            const commission = await StaticContentService.getDependingOnTitle('commission');
            await UserService.edit({id: data.driver_id, payment: ( data.price * (commission.data?.content_ar || 0) ) + user.data.payment});
            if (user.data.payment > user.data.commission_limit) {
                await UserService.edit({id: data.driver_id, is_activated: false});
            }
        }

        let title_en = "accept travel";
        let content_en = `travel from ${user.data.private_travels[0].going_from} to ${user.data.private_travels[0].going_to} has been accepted \n ${user.data.phone}`;
        let title_ar = "قبول رحلة";
        let content_ar = `الرحلة من ${user.data.private_travels[0].going_from}  الى ${user.data.private_travels[0].going_to} تم قبولها  \n ${user.data.phone}` ;
        const notification = await new NotificationService({title_ar, title_en, content_ar, content_en}).add();
        const notificationUsers = await NotificationUserService.addMany([{user_id: user.data.id, notification_id: notification.data.id}]);

        if (user.data?.token) {
            sendNotificationsMulticast([user.data.token], title_ar, content_ar);
        }

        res.status(result.status).send({
            data: result.data,
        });
    },

    editPrivateTravel: async (req, res) => {
        const data = req.body;
        data.id = req.params.private_travel_id;
        const result = await PrivateTravelService.edit(data);
        if (data.status == 'rejected') {
            data.private_travel_id = data.id;
            const cancelNote = await new CancelReservationNoteService(data).add();
        }
        
        if (data.status == 'accepted') {
            const user = await UserService.getById(req.user.id);
            const commission = await StaticContentService.getDependingOnTitle('commission');
            await UserService.edit({id: req.user.id, payment: ( result.data.price * (commission.data?.content_ar || 0) ) + user.data.payment});
            if (user.data.payment > user.data.commission_limit) {
                await UserService.edit({id: req.user.id, is_activated: false});
            }
        }

        const user = await UserService.getForOnePrivateTravel(data.id);
        
        let title_en = "private travel announcement";
        let content_en = `your private travel from ${user.data.private_travels[0].going_from} to ${user.data.private_travels[0].going_to} is ${data.status} \n ${user.data.phone}`;
        let title_ar = "ما الجديد في رحلاتك";
        let content_ar = `رحلتك الخاصة من ${user.data.private_travels[0].going_from} الى ${user.data.private_travels[0].going_to} ` + (data.status == 'rejected')? ' تم رفضها ': ` تم قبولها  \n ${user.data.phone} `;  // test
        const notification = await new NotificationService({title_ar, title_en, content_ar, content_en}).add();
        // console.log(`tt \n ${user.data.phone}`);
        const notificationUsers = await NotificationUserService.addMany({user_id: user.data.id, notification_id: notification.data.id});

        if (user.data?.token) {
            sendNotificationsMulticast([user.data.token], title_ar, content_ar);
        }
        
        res.status(result.status).send({
            data: result.data,
        });
    },

}