
var Moment = require('moment');

module.exports = (sequelize, Sequelize) => {
	const Meter_Calendar = sequelize.define('Meter_Calendar', {
	  DeviceRowID: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Value: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Counter: {
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
	  tableName: 'Meter_Calendar',
	  timestamps: false,
	});
	Meter_Calendar.removeAttribute('id');
	return Meter_Calendar;
}
