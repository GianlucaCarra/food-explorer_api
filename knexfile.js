const path = require("path");
require('dotenv').config();
const fs = require("fs");

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "database", "database.db")
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, "database", "migrationsDev")
    }
  },
  production: {
    client: 'pg',
    connection: process.env.PG_CONNECTION,
    migrations: {
      directory: path.resolve(__dirname, "database", "migrations")
    },
    ssl: {
      ca: fs.readFileSync(__dirname + '/certs/pg-credentials.crt')
    }
  }
};
