const { PrivateTravelService } = require('../../services/PrivateTravelService');
const { ReservationService } = require('../../services/ReservationService');
const fs = require('fs');
const httpStatus = require('../../utils/httpStatus');

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function checkDayInList(dayName) {
    try {
        const jsonData = fs.readFileSync('./days.json', 'utf8');
        
        const daysObject = JSON.parse(jsonData);
        
        const daysList = daysObject.days;
        
        if (daysList.includes(dayName)) {
            return {status: true};
        } else {
            const forbiddenDays = [];
            for (let i = 0; i < daysOfWeek.length; i++) {
                if (!daysList.includes(daysOfWeek[i])) {
                    forbiddenDays.push(daysOfWeek[i]);
                }
            }
            return {
                status: false,
                forbiddenDays: forbiddenDays
            };
        }
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error.message);
        return false;
    }
}

module.exports = {

    addReservation: async (req, res) => {
        const data = req.body;
        const date = new Date(data.going_date);
        const dayOfWeek = date.getDay();      
        const dayName = daysOfWeek[dayOfWeek];

        console.log(dayName);

        const checkDay = checkDayInList(dayName);

        if (checkDay.status) {
            data.user_id = req.user.id;
            data.status = 'accepted';
            const result = await new ReservationService(data).add();
            res.status(result.status).send({
                data: result.data,
            });
        } else {
            res.status(httpStatus.BAD_REQUEST).send({
                data: `you are not allowed to take reservation in days ${checkDay.forbiddenDays}`,
            });
        }

    },

    editReservation: async (req, res) => {
        const data = req.body;
        data.id = req.params.reservation_id;
        const result = await ReservationService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getMyOldReservations: async (req, res) => {
        const result = await ReservationService.getAllMyOld(req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllMyOldReservationsAndPrivateTravels: async (req, res) => {
        const privateTravels = await PrivateTravelService.getAllMyOld(req.user.id);
        const factoredPrivateTravels = privateTravels.data.map(travel => ({
            ...travel.toJSON(),
            extra: travel.reservation_extra.map( data => ({...data.extra.dataValues})),
            type: 'private'
        }))
        const reservations = await ReservationService.getAllMyOld(req.user.id);
        const factoredReservations = reservations.data.map(reservation => ({
            ...reservation.toJSON(),
            type: 'public'
        }))
        const data = [ ...factoredReservations, ... factoredPrivateTravels].sort((a, b) => {
            if (a.going_date < b.going_date) return -1;
            if (a.going_date > b.going_date) return 1;
        
            return 0;
        });
        res.status(200).send({
            data: data,
        });
    },

    getAllMyFutureReservationsAndPrivateTravelsDependingOnStatus: async (req, res) => {
        const privateTravels = await PrivateTravelService.getAllMyFutureDependingOnStatus(req.user.id, req.query.status, req.query.language);
        const factoredPrivateTravels = privateTravels.data?.map(travel => ({
            ...travel.toJSON(),
            extra: travel.reservation_extra.map( data => ({...data.extra.dataValues})),
            type: 'private'
        }))
        const reservations = await ReservationService.getAllMyFutureDependingOnStatus(req.user.id, req.query.status);
        const factoredReservations = reservations.data?.map(reservation => ({
            ...reservation.toJSON(),
            type: 'public'
        }))
        const data = [ ...factoredReservations, ... factoredPrivateTravels].sort((a, b) => {
            if (a.going_date < b.going_date) return -1;
            if (a.going_date > b.going_date) return 1;
        
            return 0;
        });
        res.status(200).send({
            data: data,
        });
    },

    getAllMyFutureReservationsAndPrivateTravels: async (req, res) => {
        try {
            console.log(req.user.id);
            const privateTravels = await PrivateTravelService.getAllMyFuture(req.user.id, req.query.language);
            const factoredPrivateTravels = privateTravels.data.map(travel => ({
                ...travel.toJSON(),
                extra: travel.reservation_extra.map( data => ({...data.extra.dataValues})),
                type: 'private'
            }));
            const reservations = await ReservationService.getAllMyFuture(req.user.id);
            const factoredReservations = reservations.data.map(reservation => ({
                ...reservation.toJSON(),
                type: 'public'
            }));
            const allTravels = [...factoredReservations, ... factoredPrivateTravels];
            const data = [ ...allTravels ].sort((a, b) => {
                
                if (a.going_date <= b.going_date) return -1;
                if (a.going_date > b.going_date) return 1;
            
                return 0;
            });
            res.status(200).send({
                data: data,
            });
        } catch (error) {
            console.error('Error fetching future reservations and private travels:', error);
            console.log('Error fetching future reservations and private travels:', error);
            res.status(500).send({
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    getMyFutureReservationsDependingOnStatus: async (req, res) => {
        const result = await ReservationService.getAllMyFutureDependingOnStatus(req.user.id, req.query.status);
        res.status(result.status).send({
            data: result.data,
        });
    },

}