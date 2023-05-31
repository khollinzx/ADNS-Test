const { Op } = require('sequelize');
const db = require('../database/models');

const {
    responseCode, errorResponse, successResponse,
} = require('../utilities/helpers');

module.exports = class Controller {
    constructor(mainRepo) {
        mainRepo;
    }

    /**
     *
     * create controller
     * @static
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    create = async (req, res) => {
        try {
            if (req.body.files) delete req.body.files;
            const resource = await this.mainRepo.create(req.body);
            if (resource.dataValues.password) delete resource.dataValues.password;
            return successResponse(res, responseCode.CREATED, 'resource has been added.', resource);
        } catch (err) {
            console.log(err);
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

    /**
     *
     * create admin controller
     * @static
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    bulkCreate = async (req, res) => {
        try {
            const resources = await this.mainRepo.bulkCreate(req.body);
            return successResponse(res, responseCode.CREATED, 'resources have been added.', resources);
        } catch (err) {
            console.log(err);
            if (err.name === 'SequelizeForeignKeyConstraintError') {
                return errorResponse(res, responseCode.BAD_REQUEST, `you've entered a wrong ID in the following fields: ${err.fields}`, err.fields, req.body.files);
            }
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

    /**
     *
     *  update resource
     * @static
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    update = async (req, res) => {
        try {
            const id = req.body.id || req.params.id;
            if (req.body.files) delete req.body.files;

            const { restore } = req.query;
            if (restore) {
                await req.deleted.restore();
                return successResponse(res, responseCode.SUCCESS, 'resource has been restored.', await this.mainRepo.getModelById(id));
            }

            const resource = await this.mainRepo.updateModel(id, req.body);
            return successResponse(res, responseCode.SUCCESS, 'resource has been updated.', resource);
        } catch (err) {
            console.log(err);
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

    /**
     *
     * get filtered resources by given conditions
     * @static
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    getAll = async (req, res) => {
        try {
            const page = req.page;
            const limit = req.limit;
            const resources = await this.mainRepo.getPaginatedCollectionWithAssociations(filterObj, page, limit)
            if(resources.length > 0) return errorResponse(res, responseCode.BAD_REQUEST, 'no records found');
            return successResponse(res, responseCode.SUCCESS, 'resources has been delivered.', resources);
        } catch (err) {
            console.log(err);
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

    /**
     *
     * get one resource controller
     * @static
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    getOne = async (req, res) => {
        try {
            const { id } = req.params;
            const resource = await this.mainRepo.getModelWithAssociations(id);
            if (!resource) return errorResponse(res, responseCode.BAD_REQUEST, 'resource does not exist.');
            return successResponse(res, responseCode.SUCCESS, 'resource has been delivered.', resource);
        } catch (err) {
            console.log(err);
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

    /**
     *
     * delete resource controller
     * @static
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    delete = async (req, res) => {
        try {
            const { id } = req.params;

            //  const resource = await this.mainRepo.getModelById(id);

            //  if (!resource) return errorResponse(res, responseCode.BAD_REQUEST, 'resource does not exist.');

            //  await this.mainRepo.deleteModel(id);

            //  await actionRepo.logAction('DELETE', req.currentAdmin.id, resource);

            //  return successResponse(res, responseCode.SUCCESS, 'resource has been deleted.');
            const { force_delete } = req.query;
            let ids = [id];
            if (id === 'delete-many') {
                ids = req.body.ids;
            }
            const condition = {
                where: {
                    id: { [Op.in]: ids },
                },
            };
            if (force_delete === 'true') {
                condition.force = true;
            }
            await this.mainRepo.deleteModelByCondition(condition);
            await actionRepo.logAction('DELETE', req.currentAdmin.id, []);
            return successResponse(res, responseCode.SUCCESS, 'resources has been deleted.');
        } catch (err) {
            console.log(err);
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }

    /**
     *
     * delete many resource controller
     * @static
     * @param {*} req
     * @param {*} res
     * @return {*}
     */
    deleteMany = async (req, res) => {
        try {
            const { ids } = req.body;
            await this.mainRepo.deleteModelByCondition({
                where: {
                    id: { [Op.in]: ids },
                },
            });
            await actionRepo.logAction('DELETE', req.currentAdmin.id, []);
            return successResponse(res, responseCode.SUCCESS, 'resources has been deleted.');
        } catch (err) {
            console.log(err);
            return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
        }
    }
}

