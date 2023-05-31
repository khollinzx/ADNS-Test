const db = require('../models')
const MainRepository = require('../repositories/mainRepository')

module.exports = class UserRepository extends MainRepository{
    constructor() {
        super();
        this.model = db.users;
    }

    /**
     *
     * @returns {Promise<Model|null>}
     * @param payload
     */
    async createNewUser(payload) {
        return this.model.create(payload);
    }

    /**
     *
     * @param id
     * @returns {Promise<Model|null>}
     */
    async findUserByID(id) {
        return this.model.findOne({where: { id }});
    }

    /**
     *
     * @returns {Promise<Model|null>}
     * @param email
     */
    async findUserByEmail(email) {
        return this.model.findOne({where: { email }});
    }

    /**
     *
     * @returns {Promise<Model|null>}
     * @param Object
     */
    async queryModel(Object) {
        return this.model.findOne(Object);
    }
}
