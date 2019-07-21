const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const databases = require('./env');

/*
const databases = {
    "DEV": {
        name: 'mainDB', 
        username: null, 
        password: null, 
        options: {
            dialect: "sqlite",
            storage: './database.sqlite'
        }
    }, "ACCEPTANCE": {
        name: 'proddb', 
        username: 'pi', 
        password: 'jansen22', 
        options: {
            dialect: "postgres"
        }
    }, "PRODUCTION": {
        name: 'proddb', 
        username: 'pi', 
        password: 'jansen22', 
        options: {
            dialect: "postgres"
        }
    }
}
* */

const database = databases[process.env.DB];

let sequelize;
if(database.type === 'URL'){
    if(database.ssl){
        var pg = require('pg');
        pg.defaults.ssl = true;
    }
    sequelize = new Sequelize(database.url);
}else if(database.type === 'settings'){
    sequelize = new Sequelize(database.name, database.username, database.password, database.options);
}else{
    throw "No database config found";
}


/*
var sequelizeDomoticz = new Sequelize('domoticzDB', null, null, {
    dialect: "sqlite",
    storage: '/home/pi/domoticz/domoticz.db'
});
* */

 
const db = {};
 
db.sequelize = sequelize;
//db.sequelizeDomoticz = sequelizeDomoticz;

var normalizedPath = path.join(__dirname, "../models");

fs.readdirSync(normalizedPath).forEach(function(file) {
  const modelname = file.replace('.model.js', '').replace('domoticz.', '')
  if(file.startsWith('domoticz')){
      //db[modelname] = require("../models/" + file)(sequelizeDomoticz, Sequelize);
  }else{
      db[modelname] = require("../models/" + file)(sequelize, Sequelize);
  }
  console.log('Model ' + file + ' wordt geladen');
});
 
module.exports = db;
