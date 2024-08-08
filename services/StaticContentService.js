const { 
    StaticContent,
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const sequelize = require('sequelize');
const { Op } = sequelize;

class StaticContentService {

    constructor(data) {
        this.title = data.title;
        this.description_en = data.description_en;
        this.description_ar = data.description_ar;
        this.content_en = data.content_en;
        this.content_ar = data.content_ar;
    }

    static async getAll() {
        try {
            const staticContents = await StaticContent.findAll({});
            return {
                data: staticContents,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllPriceAndCommission(language = 'ar') {
        try {
            const description = language === 'ar' ? 'description_ar' : 'description';
            const content = language === 'ar' ? 'content_ar' : 'content';
            const staticContents = await StaticContent.findAll({
                attributes: [
                    'id',
                    'title',
                    [sequelize.col(description), 'description'],
                    [sequelize.col(content), 'content']
                ],
                where: {
                    title: {
                        [Op.in]: ['price', 'commission']
                    }
                }
            });
            return {
                data: staticContents,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAllForOneLanguage(language) {
        try {
            const description = language === 'ar' ? 'description_ar' : 'description_en';
            const content = language === 'ar' ? 'content_ar' : 'content_en';
            const staticContents = await StaticContent.findAll({
                attributes: [
                    'id',
                    'title',
                    [sequelize.col(description), 'description'],
                    [sequelize.col(content), 'content']
                ]
            });
            return {
                data: staticContents,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getDependingOnTitle(title) {
        try {
            const staticContent = await StaticContent.findOne({
                where: {
                    title: title
                }
            });
            return {
                data: staticContent,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getDependingOnTitleForLanguage(title, language) {
        try {
            const description = language === 'ar' ? 'description_ar' : 'description_en';
            const content = language === 'ar' ? 'content_ar' : 'content_en';
            const staticContent = await StaticContent.findOne({
                attributes: [
                    'id',
                    'title',
                    [sequelize.col(description), 'description'],
                    [sequelize.col(content), 'content']
                ],
                where: {
                    title: title
                }
            });
            return {
                data: staticContent,
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async edit(data) {
        try {
            const staticContent = await StaticContent.findByPk(data.id);
            staticContent.title = data.title || staticContent.title;
            staticContent.description_en = data.description_en || staticContent.description_en;
            staticContent.description_ar = data.description_ar || staticContent.description_ar;
            staticContent.content_en = data.content_en || staticContent.content_en;
            staticContent.content_ar = data.content_ar || staticContent.content_ar;
            if (data.is_show == true || data.is_show == false) { 
                staticContent.is_show = data.is_show;
            }
            await staticContent.save();
            return {
                data: 'updated',
                status: httpStatus.OK
            };
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

}

module.exports = { StaticContentService };