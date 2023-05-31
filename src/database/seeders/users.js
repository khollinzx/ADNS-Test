const db = require('../models');
const { hashPassword } = require('../../utilities/helpers');

class UsersSeed {
    constructor() {
        this.data = [
            {
                id: 1,
                name: 'Faith Ugbeshe',
                email: 'faith@gmail.com',
                password: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];
    }

    async run() {
        try {
            const hash = await hashPassword('password');
            this.data[0].password = hash;
            await db.users.bulkCreate(this.data, { updateOnDuplicate: ['id', 'name', 'email', 'password', 'updated_at'] });
            console.log('=== users seed completed');
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = UsersSeed;
