const env = require('./env.js');
var fs = require('fs');
const path = require('path');
 
const Sequelize = require('sequelize');

const databases = {
    "DEV": {
        name: 'mainDB', 
        username: null, 
        password: null, 
        options: {
            dialect: "sqlite",
            storage: './database.sqlite'
        }
    }, "PROD": {
        name: 'proddb', 
        username: 'pi', 
        password: 'jansen22', 
        options: {
            dialect: "postgres"
        }
    }, "HEROKU": process.env.DATABASE_URL
    
}

const database = databases[process.env.DB];

if(database === undefined) throw "No database config found";

let sequelize;
if(process.env.DB === 'HEROKU'){
    sequelize = new Sequelize(database);
}else{
    sequelize = new Sequelize(database.name, database.username, database.password, database.options);
}



var sequelizeDomoticz = new Sequelize('domoticzDB', null, null, {
    dialect: "sqlite",
    storage: '/home/pi/domoticz/domoticz.db'
});

 
const db = {};
 
db.sequelize = sequelize;
db.sequelizeDomoticz = sequelizeDomoticz;

var normalizedPath = path.join(__dirname, "../models");

fs.readdirSync(normalizedPath).forEach(function(file) {
  const modelname = file.replace('.model.js', '').replace('domoticz.', '')
  if(file.startsWith('domoticz')){
      db[modelname] = require("../models/" + file)(sequelizeDomoticz, Sequelize);
  }else{
      db[modelname] = require("../models/" + file)(sequelize, Sequelize);
  }
  console.log('Model ' + file + ' wordt geladen');
});
 
module.exports = db;