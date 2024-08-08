const { StaticContentService } = require('../../services/StaticContentService');


module.exports = {
    
    getStaticContentDependingOnTitle: async (req, res) => {
        const result = await StaticContentService.getDependingOnTitleForLanguage(req.query.title, req.query.language);
        res.status(result.status).send({
            data: result.data,
        });
    },
    
    getPrivateTravelPriceAndCommission: async (req, res) => {
        const result = await StaticContentService.getAllPriceAndCommission(req.query.language);
        const data = {};
        for (const item of result.data) {
            data[item.title] = item.content;
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

}