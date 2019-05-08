const env = require('./env.js');
var fs = require('fs');
const path = require('path');
 
const Sequelize = require('sequelize');
var sequelize = new Sequelize('mainDB', null, null, {
    dialect: "sqlite",
    storage: './database.sqlite'
});

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
