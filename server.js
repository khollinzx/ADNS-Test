const app = require("./app");
const { port, nodeEnv } = require('./config');


app.listen(port, () => {
    console.log(`Welcome to ${nodeEnv} ADNS-Test (Automated Deposit Notification System) API on port ${port}`);
});
