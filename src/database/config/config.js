const config = require('../../../config');

module.exports = {
  development: {
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: 'mysql',
    logging: false,
  },
  test: {
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: 'mysql',
    logging: false,
  },
};
