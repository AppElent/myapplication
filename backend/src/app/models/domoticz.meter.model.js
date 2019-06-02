
var Moment = require('moment');

module.exports = (sequelize, Sequelize) => {
	const Meter = sequelize.define('Meter', {
	  DeviceRowID: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Value: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Usage: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Date: {
		type: Sequelize.DATE,
		allowNull: false,
		get: function () {
			return Moment(this.getDataValue('Date')).utc().format().replace("Z","+01:00");
		}
	  }
	},{
	  tableName: 'Meter',
	  timestamps: false,
	});
	Meter.removeAttribute('id');
	return Meter;
}
