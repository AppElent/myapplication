
var Moment = require('moment');

module.exports = (sequelize, Sequelize) => {

	const Meterstanden = sequelize.define('meterstanden', {
	  datetime: {
		type: Sequelize.DATE,
		primaryKey: true,
		get: function () {
			return Moment(this.getDataValue('datetime')).tz('Europe/Amsterdam');//.format('YYYY-MM-DD HH:mm:ss');
		}
	  },
	  180: {
		type: Sequelize.STRING
	  },181: {
		type: Sequelize.STRING
	  },182: {
		type: Sequelize.STRING
	  },280: {
		type: Sequelize.STRING
	  },281: {
		type: Sequelize.STRING
	  },282: {
		type: Sequelize.STRING
	  },
	},{
	  tableName: 'meterstanden',
	});
	
	return Meterstanden;
}
