var admin = require("firebase-admin");

var serviceAccount = require("../../yorway-6371c-57d60b03021c.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const sendNotifications = async (token, title, body) => {
    const message = {
        tokens: token,
        notification: {
            title: title,
            body: body
        }
    }
    try {
        const response = await admin.messaging().sendMulticast(message);
        console.log(response);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = sendNotifications;