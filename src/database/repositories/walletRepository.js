const db = require('../models')
const MainRepository = require('../repositories/mainRepository')

module.exports = class WalletRepository extends MainRepository{
    constructor() {
        super();
        this.model = db.user_wallets;
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
     * @param user_id
     */
    async findUserWalletByUserId(user_id ) {
        return this.model.findOne({where: { user_id }});
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
