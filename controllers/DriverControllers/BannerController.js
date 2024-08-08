const { BannerService } = require('../../services/BannerService');


module.exports = {

    getAllBanners: async (req, res) => {
        const result = await BannerService.getAllForOneLanguage(req.query.language);
        res.status(result.status).send({
            data: result.data,
        });
    },

}