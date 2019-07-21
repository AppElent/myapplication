
const databases = {
    "DEV": {
	name: 'mainDB', 
        username: null, 
        password: null, 
	dialect: "sqlite",
	storage: './database.sqlite'
    }, "TEST": {
	name: 'mainDB', 
        username: null, 
        password: null, 
	dialect: "sqlite",
	storage: './database.sqlite'
    }, "ACCEPTANCE": {
	ssl: true,
	use_env_variable: process.env.DATABASE_URL,
	dialect: "postgres"
    }, "PRODUCTION": {
	ssl: true,
	use_env_variable: process.env.DATABASE_URL,
	dialect: "postgres"
    }
}

module.exports = databases;

/*

const env = {
  database: 'testdb',
  username: 'root',
  password: '12345',
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
	  max: 5,
	  min: 0,
	  acquire: 30000,
	  idle: 10000
  }
};
 
module.exports = env;
* */
