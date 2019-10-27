/*
 * DEFAULT FILE:
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }
}
* */
require('dotenv').config();

const databases = {
  "development": {
    database: 'mainDB',
    username: null,
    password: null,
    dialect: "sqlite",
    storage: './database.sqlite',
  }, "test": {
    database: 'mainDB',
    username: null,
    password: null,
    dialect: "sqlite",
    storage: './database_test.sqlite',
  }, "production": {
    ssl: true,
    use_env_variable: 'DATABASE_URL',
    dialect: "postgres",
    dialectOptions: {
      ssl: true
    }
  }
}


module.exports = databases;
