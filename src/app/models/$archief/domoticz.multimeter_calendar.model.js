
var Moment = require('moment');

module.exports = (sequelize, Sequelize) => {
	const MultiMeter_Calendar = sequelize.define('MultiMeter_Calendar', {
	  DeviceRowID: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Value1: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Value2: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Value3: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Value4: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Value5: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Value6: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Counter1: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Counter2: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Counter3: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  Counter4: {
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
	  tableName: 'MultiMeter_Calendar',
	  timestamps: false,
	});
	MultiMeter_Calendar.removeAttribute('id');
	return MultiMeter_Calendar;
}
