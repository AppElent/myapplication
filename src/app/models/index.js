'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../../config/database/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  if(config.ssl){
    var pg = require('pg');
    pg.defaults.ssl = true;
  }
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
}else {
  console.log(config);
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    //const model = sequelize['import'](path.join(__dirname, file));
    //db[model.name] = model;
    const modelname = file.replace('.model.js', '')
    db[modelname] = require('./' + file)(sequelize, Sequelize);
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
