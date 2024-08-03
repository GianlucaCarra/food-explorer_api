require('dotenv').config();
const path = require("path");

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
      directory: path.resolve(__dirname, "dist", "database", "migrationsDev")
    }
  },
  production: {
    client: 'pg',
    connection: process.env.PG_CONNECTION,
    migrations: {
      directory: path.resolve(__dirname, "dist", "database", "migrations")
    },
    ssl: {
      rejectUnauthorized: false,
    }
  }
};
