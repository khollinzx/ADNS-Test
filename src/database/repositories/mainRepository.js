/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
const { Op } = require('sequelize');

const { pagingData } = require('../../utilities/helpers');

module.exports = class MainRepository {
    constructor(model) {
        model;
    }

    /**
     *
     *
     * @param {*} data
     * @return {*}
     * @memberof BaseRepository
     */
    async create(data) {
        return this.model.create(data);
    }

    /**
     *
     *
     * @param {*} data
     * @return {*}
     * @memberof BaseRepository
     */
    async bulkCreate(data, config) {
        if (config) {
            return this.model.bulkCreate(data, config);
        }
        return this.model.bulkCreate(data);
    }

    /**
     *
     *
     * @param {*} id
     * @param {*} data
     * @return {*}
     * @memberof BaseRepository
     */
    async updateModel(id, data) {
        await this.model.update(data, { where: { id }, individualHooks: true });
    }

    /**
     *
     *
     * @param {*} data
     * @param {*} condition
     * @return {*}
     * @memberof BaseRepository
     */
    async updateModelByCondition(data, condition) {
        await this.model.update(data, { where: condition });
        return this.getModelByCondition({ where: condition });
    }

    /**
     *
     *
     * @param {*} filterObj
     * @return {*}
     * @memberof BaseRepository
     */
    async getModelByCondition(filterObj) {
        return this.model.findOne(filterObj);
    }

    /**
     *
     *
     * @param {*} filterObj
     * @return {*}
     * @memberof BaseRepository
     */
    async getCollectionByCondition(filterObj = {}) {
        return this.model.findAll(filterObj);
    }

    /**
     *
     *
     * @param {*} id
     * @return {*}
     * @memberof BaseRepository
     */
    async getModelById(id) {
        return this.model.findOne({ where: { id } });
    }

    /**
     *  get paginated collection
     *
     * @param {*} [filterObj={}]
     * @return {*}
     * @memberof BaseRepository
     */
    async getCollection(filterObj = {}, page, limit) {
        const data = await this.model.findAndCountAll(filterObj);
        return pagingData(data, page, limit);
    }

    /**
     * get paginated collection in descending order
     *
     * @param {*} page
     * @param {*} size
     * @return {*}
     * @memberof BaseRepository
     */
    async getPaginatedCollection(limit, offset, page) {
        const data = await this.model.findAndCountAll({
            order: [['id', 'DESC']],
            limit,
            offset,
        });
        return pagingData(data, page, limit);
    }

    /**
     *
     *
     * @param {*} id
     * @return {*}
     * @memberof BaseRepository
     */
    async deleteModel(id) {
        return this.model.destroy({ where: { id } });
    }

    /**
     *
     *
     * @param {*} id
     * @return {*}
     * @memberof BaseRepository
     */
    async deleteModelByCondition(filterObj) {
        return this.model.destroy(filterObj);
    }
}
