const { PrivateTravelService } = require("../../services/PrivateTravelService");
const { TrackingUserService } = require("../../services/TrackingUserService");

module.exports = { 

    addUser(key, socket_id, user_id) {
        if (!connectedUsers[key]) {
        connectedUsers[key] = [];
        }
        connectedUsers[key].push({ socket_id, user_id });
    },

    removeUser(key, socket_id) {
        if (connectedUsers[key]) {
            connectedUsers[key] = connectedUsers[key].filter(
                user => user.socket_id !== socket_id
            );
            if (connectedUsers[key].length === 0) {
                delete connectedUsers[key];
            }
        }
    },

    findUserBySocketId(socket_id) {
        for (let key in connectedUsers) {
            const user = connectedUsers[key].find(user => user.socket_id === socket_id);
            if (user) {
                return { key, user };
            }
        }
        return null;
    },

    findUserByUserId(user_id) {
        for (let key in connectedUsers) {
            const user = connectedUsers[key].find(user => user.user_id === user_id);
            if (user) {
                return { key, user };
            }
        }
        return null;
    },

    async addCode(user_id, code) {
        const privateTravel = await PrivateTravelService.getDependingOnCode(code);
        if (privateTravel?.data?.id) {
            const result = await new TrackingUserService({user_id: user_id, private_travel_id: privateTravel.data.id}).add();
            return {
                status: 200,
                data: privateTravel.data.id,
            }
        } else { 
            return {
                status: 400,
                data: 'related successfully',
            }
        }
    },

    removeUser (socketId) {
        for (const key in connectedUsers) {
            if (connectedUsers.hasOwnProperty(key)) {
                connectedUsers[key] = connectedUsers[key].filter(user => user.socket_id !== socketId);
                if (connectedUsers[key].length === 0) {
                    delete connectedUsers[key];
                }
            }
        }
    },

    getAllSocketIds (private_travel_id) {
        if (connectedUsers[private_travel_id]) {
            return connectedUsers[private_travel_id].map(user => user.socket_id);
        }
        return [];
    }
    
}
