const env = require('./env.js');
 
const Sequelize = require('sequelize');
var sequelize = new Sequelize('mainDB', null, null, {
    dialect: "sqlite",
    storage: './database.sqlite'
});

 
const db = {};
 
db.sequelize = sequelize;
 
//Models/tables
db.customers = require('../models/customer.model.js')(sequelize, Sequelize);
db.events = require('../models/event.model.js')(sequelize, Sequelize);
db.config = require('../models/config.model.js')(sequelize, Sequelize);
db.rekeningen = require('../models/rekening.model.js')(sequelize, Sequelize);
db.meterstanden = require('../models/meterstanden.model.js')(sequelize, Sequelize);

 
module.exports = db;
