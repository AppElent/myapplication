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
