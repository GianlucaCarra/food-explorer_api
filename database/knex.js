const knexConfig = require('../knexfile');
const knex = require('knex');

const connection = knex(knexConfig.production);

module.exports = connection;