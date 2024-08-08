const { StaticContentService } = require('../../services/StaticContentService');


module.exports = {

    deleteStaticContent: async (req, res) => {
        const result = await StaticContentService.delete(req.params.static_content_id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    editStaticContent: async (req, res) => {
        const data = req.body;
        data.id = req.params.static_content_id;
        const result = await StaticContentService.edit(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    getAllStaticContents: async (req, res) => {
        const result = await StaticContentService.getAll();
        res.status(result.status).send({
            data: result.data,
        });
    },

    getStaticContentDependingOnTitle: async (req, res) => {
        const result = await StaticContentService.getDependingOnTitle(req.query.title);
        res.status(result.status).send({
            data: result.data,
        });
    },

}