
var Moment = require('moment');

module.exports = (sequelize, Sequelize) => {

	const MeterstandElektra = sequelize.define('meterstanden_elektra', {
	  datetime: {
		type: Sequelize.DATE,
		primaryKey: true,
		get: function () {
			return Moment(this.getDataValue('datetime')).tz('Europe/Amsterdam').format('YYYY-MM-DD HH:mm:ss');
		}
	  },
	  kwh_180: {
		type: Sequelize.STRING
	  },kwh_181: {
		type: Sequelize.STRING
	  },kwh_182: {
		type: Sequelize.STRING
	  },kwh_280: {
		type: Sequelize.STRING
	  },kwh_281: {
		type: Sequelize.STRING
	  },kwh_282: {
		type: Sequelize.STRING
	  },kwh_opwekking: {
		type: Sequelize.STRING
	  },warmte: {
		type: Sequelize.STRING
	  },
	});
	
	return MeterstandElektra;
}
