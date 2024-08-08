const { 
    Extra,
    sequelize
} = require('../models');
const httpStatus = require('../utils/httpStatus');
const { Op } = require('sequelize');

class ExtraService {

    constructor(data) {
        this.title_en = data.title_en;
        this.title_ar = data.title_ar;
        this.price = data.price;
    }

    async add() {
        try {
            const extra = await Extra.create(this);
            return {
                data: extra,
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
            const extra = await Extra.findByPk(data.id);
            extra.title_en = data.title_en || extra.title_en;
            extra.title_ar = data.title_ar || extra.title_ar;
            extra.price = data.price || extra.price;
            await extra.save();
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

    static async delete(ids) {
        try {
            const deletedExtras = await Extra.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (deletedExtras > 0) {
                return {
                    data: 'deleted',
                    status: httpStatus.OK
                };
            } else {
                return {
                    data: 'something went wrong',
                    status: httpStatus.BAD_REQUEST
                };
            }
        } catch (error) {
            return {
                data: error.message,
                status: httpStatus.BAD_REQUEST
            };
        }
    }

    static async getAll() {
        try {
            const Extras = await Extra.findAll({});
            return {
                data: Extras,
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
            const title = language === 'ar' ? 'Extra.title_ar' : 'Extra.title_en';
            const extras = await Extra.findAll({
                attributes: [
                    'id',
                    [sequelize.col(title), 'title'],
                    'price'
                ],
            });
            return {
                data: extras,
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

module.exports = { ExtraService };