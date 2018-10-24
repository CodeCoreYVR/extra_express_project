// Update with your config settings.

const commonConfig = {
  client: "pg",
  connection: {
    database: "express_demo"
    // The following two fields are required for a Linux
    // setup. If you don't have a password for your user,
    // you must create one.
    // To set a password, do the following:
    // $ psql
    // my_user=# \password

    // username: "sg",
    // password: "supersecret"
  },
  migrations: {
    tableName: "migrations",
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

module.exports = {
  development: {
    ...commonConfig
  },
  production: {
    ...commonConfig,
    // https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js
    // https://knexjs.org/#knexfile
    connection: process.env.DATABASE_URL
  }
};
