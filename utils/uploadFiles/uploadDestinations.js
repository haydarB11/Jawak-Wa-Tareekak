const { upload } = require('./multerUpload');

const uploadBanner = upload('public/Banners');
const uploadAdvertisement = upload('public/Advertisements');

module.exports = {
    uploadBanner,
    uploadAdvertisement,
};