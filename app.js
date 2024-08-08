require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const server = http.createServer(app);
const { UserService } = require('./services/UserService');
const { addCode, addUser, removeUser, getAllSocketIds } = require('./utils/helper/Tracking');

const corsOptions = { 
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    headers: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const io = socketIo(server);

const connectedUsers = {};

global.connectedUsers = connectedUsers;

io.use((socket, next) => {
    const token = socket.handshake.query.token;

    if (token) {
        jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.user = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
});

server.listen(process.env.PORT, async () => {
    // await sequelize.sync({alter:true});
    console.log(`WebSocket server is listening on port: ${process.env.PORT}`);
});

io.on('connection', (socket) => {
    console.log('A user connected. Socket ID:', socket.id);

    socket.on('add_code', async ({ code }) => {
        if (socket.user) {
            const user_id = socket.user.id;
            const response = await addCode(user_id, code);
            if (response.status == 200) {
                addUser(response.data, socket.id, user_id);
                io.to(socket.id).emit('add_code_response', {status: 200});
            } else {
                io.to(socket.id).emit('add_code_response', {status: 400});
            }
        } else {
            io.to(socket.id).emit('add_code_response', {status: 401});
            console.log('User not authenticated');
        }
        console.log('User added:', connectedUsers);
    });

    socket.on('coordinates', async ({private_travel_id, lat, lon}) => {
        const socket_ids = getAllSocketIds(private_travel_id);
        socket_ids.forEach((id) => {
            io.to(id).emit('tracking', {
                lat: lat.toFixed(10),
                lon: lon.toFixed(10),
            });
        });
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected. Socket ID:', socket.id);
        removeUser(socket.id);
    });
});

app.set('socketIo', io);
app.set('connectedUsers', global.connectedUsers);



app.use('/jawak-wa-tareekak/public', express.static(path.join(__dirname, 'public')));
app.get('/jawak-wa-tareekak', (req, res) => {
    return res.json("welcome to jawak-wa-tareekak app!");
});

// manager routes
app.use('/jawak-wa-tareekak/manager/lines', require('./routes/ManagerRoutes/LineRouter'));
app.use('/jawak-wa-tareekak/manager/notifications', require('./routes/ManagerRoutes/NotificationRouter'));
app.use('/jawak-wa-tareekak/manager/travels', require('./routes/ManagerRoutes/TravelRouter'));
app.use('/jawak-wa-tareekak/manager/reservations', require('./routes/ManagerRoutes/ReservationRouter'));
app.use('/jawak-wa-tareekak/manager/banners', require('./routes/ManagerRoutes/BannerRouter'));
app.use('/jawak-wa-tareekak/manager/static-contents', require('./routes/ManagerRoutes/StaticContentRouter'));
app.use('/jawak-wa-tareekak/manager/extra', require('./routes/ManagerRoutes/ExtraRouter'));
app.use('/jawak-wa-tareekak/manager/days', require('./routes/ManagerRoutes/DayRouter'));
app.use('/jawak-wa-tareekak/manager/holidays', require('./routes/ManagerRoutes/DriverHolidayRouter'));
app.use('/jawak-wa-tareekak/manager/commissions', require('./routes/ManagerRoutes/CommissionRouter'));
app.use('/jawak-wa-tareekak/manager', require('./routes/ManagerRoutes/UserRouter'));

// user routes
app.use('/jawak-wa-tareekak/user/static-contents', require('./routes/UserRoutes/StaticContentRouter'));
app.use('/jawak-wa-tareekak/user/banners', require('./routes/UserRoutes/BannerRouter'));
app.use('/jawak-wa-tareekak/user/notifications', require('./routes/UserRoutes/NotificationRouter'));
app.use('/jawak-wa-tareekak/user/lines', require('./routes/UserRoutes/LineRouter'));
app.use('/jawak-wa-tareekak/user/travels', require('./routes/UserRoutes/TravelRouter'));
app.use('/jawak-wa-tareekak/user/reservations', require('./routes/UserRoutes/ReservationRouter'));
app.use('/jawak-wa-tareekak/user/extra', require('./routes/UserRoutes/ExtraRouter'));
app.use('/jawak-wa-tareekak/user/days', require('./routes/UserRoutes/DayRouter'));
app.use('/jawak-wa-tareekak/user', require('./routes/UserRoutes/UserRouter'));

// driver routes
app.use('/jawak-wa-tareekak/driver/static-contents', require('./routes/DriverRoutes/StaticContentRouter'));
app.use('/jawak-wa-tareekak/driver/banners', require('./routes/DriverRoutes/BannerRouter'));
app.use('/jawak-wa-tareekak/driver/notifications', require('./routes/DriverRoutes/NotificationRouter'));
app.use('/jawak-wa-tareekak/driver/lines', require('./routes/DriverRoutes/LineRouter'));
app.use('/jawak-wa-tareekak/driver/bus', require('./routes/DriverRoutes/BusRouter'));
app.use('/jawak-wa-tareekak/driver/travels', require('./routes/DriverRoutes/TravelRouter'));
app.use('/jawak-wa-tareekak/driver/reservations', require('./routes/DriverRoutes/ReservationRouter'));
app.use('/jawak-wa-tareekak/driver/holidays', require('./routes/DriverRoutes/DriverHolidayRouter'));
app.use('/jawak-wa-tareekak/driver/Ads', require('./routes/DriverRoutes/DriverAdRouter'));
app.use('/jawak-wa-tareekak/driver', require('./routes/DriverRoutes/UserRouter'));

module.exports = {
    io: io, 
    connectedUsers: global.connectedUsers
};
