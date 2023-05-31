const db = require('../models');

class UserWalletsSeed {
    constructor() {
        this.data = [
            {
                id: 1,
                user_id: 1,
                amount: 20000,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];
    }

    async run() {
        try {
            await db.user_wallets.bulkCreate(this.data, { updateOnDuplicate: ['id', 'user_id', 'amount'] });
            console.log('=== user wallets seed completed');
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = UserWalletsSeed;
