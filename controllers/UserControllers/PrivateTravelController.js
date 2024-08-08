const { PrivateTravelExtraService } = require('../../services/PrivateTravelExtraService');
const { PrivateTravelService } = require('../../services/PrivateTravelService');
const { TrackingUserService } = require('../../services/TrackingUserService');
const sendNotificationsMulticast = require('../../utils/notification/notification');
const { UserService } = require('../../services/UserService');
const { BusService } = require('../../services/BusService');
const { NotificationService } = require('../../services/NotificationService');
const { NotificationUserService } = require('../../services/NotificationUserService');


module.exports = {

    addPrivateTravelReservation: async (req, res) => {
        const data = req.body;
        data.user_id = req.user.id;
        data.status = 'pending';
        data.is_redirected = false;
        if (data.driver_id) {
            const bus = await BusService.getForOneDriver(data.driver_id);
            data.bus_id = bus.data.id;
        }
        else {
            let users = await UserService.getTokenFromDataBaseForSpecificTypesOfUsers(['driver', 'super_driver']);
            if (users.length > 0) {
                let tokens = await UserService.splitTokens(users, 500);
                let title_en = "new private travel";
                let content_en = `new private travel from ${data.going_from} to ${data.going_to}`;
                let title_ar = 'رحلة جديدة';
                let content_ar = `تمت اضافة رحلة خاصة من ${data.going_from} الى ${data.going_to}`;
                users = await UserService.getAllForSpecificTypes(['driver', 'super_driver']);
                const notification = await new NotificationService({title_ar, title_en, content_ar, content_en}).add();
                const factoredNotificationUsers = users.data.map(user => ({
                    user_id: user.id,
                    notification_id: notification.data.id
                }));
                const notificationUsers = await NotificationUserService.addMany(factoredNotificationUsers);
                tokens.forEach(async (item) => {
                    await sendNotificationsMulticast(item, title_ar, content_ar);
                });
            }
        }
        const result = await new PrivateTravelService(data).add();
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

    editPrivateTravel: async (req, res) => {
        const data = req.body;
        data.id = req.params.private_travel_id;
        const result = await PrivateTravelService.edit(data);
        if (data.extra_ids) {
            const deletedPrivateExtra = await PrivateTravelExtraService.deleteAllForOnePrivate(result.data.id);
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

    getAllMyFuturePrivateTravelsDependingOnStatus: async (req, res) => {
        const result = await PrivateTravelService.getAllMyFutureDependingOnStatus(req.user.id, req.query.status, req.query.language);
        const data = result.data.map( travel => ({
            ...travel.toJSON(),
            extra: travel.reservation_extra.map( data => ({...data.extra.dataValues}))
        }));
        res.status(result.status).send({
            data: data,
        });
    },

    getAllMyOldPrivateTravels: async (req, res) => {
        const result = await PrivateTravelService.getAllMyOld(req.user.id, req.query.language);
        const data = result.data.map( travel => ({
            ...travel.toJSON(),
            extra: travel.reservation_extra.map( data => ({...data.extra.dataValues}))
        }));
        res.status(result.status).send({
            data: data,
        });
    },

    getPrivateTravelDependingOnCode: async (req, res) => {
        const result = await PrivateTravelService.getDependingOnCode(req.query.code);
        if (result?.data?.id) {    
            res.status(result.status).send({
                data: result.data,
            });
        } else {    
            res.status(404).send({
                data: 'not found',
            });
        }
    },

    addCode: async (req, res) => {
        const { code } = req.body;
        const privateTravel = await PrivateTravelService.getDependingOnCode(code);
        if (privateTravel?.data?.id) {
            const result = await new TrackingUserService({user_id: req.user.id, private_travel_id: privateTravel.data.id}).add();
            res.status(result.status).send({
                data: 'related successfully',
            });
        } else {    
            res.status(400).send({
                data: 'no matched travel',
            });
        }
    },

}