const UsersSeed = require('./users');
const UserWalletsSeed = require('./user_wallets');

class Seeder {
    constructor() {
        this.UsersSeed = new UsersSeed();
        this.UserWalletsSeed = new UserWalletsSeed();
    }

    async run() {
        // await this.UsersSeed.run();
        // await this.UserWalletsSeed.run();
    }
}

const seeder = new Seeder();
(async () => {
    try {
        console.log('seeding data..');
        await seeder.run();
        console.log('..done');
    } catch (err) {
        console.log(err);
    }
})();
