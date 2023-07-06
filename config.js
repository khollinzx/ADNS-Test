require('dotenv').config({ silent: true, path: '.env' });

module.exports = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    jwtKey: process.env.JWT_KEY,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    host: process.env.DB_HOST,
    mailgunSenderEmail: process.env.MAIL_FROM_ADDRESS,
    mailgunSender: process.env.MAIL_FROM_NAME,
    mailgunKey: process.env.MAIL_API_KEY,
    mailgunDomain: process.env.MAIL_DOMAIN_NAME,
};
