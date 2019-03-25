
var Moment = require('moment');

module.exports = (sequelize, Sequelize) => {
	const MultiMeter = sequelize.define('MultiMeter', {
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
	  Date: {
		type: Sequelize.DATE,
		allowNull: false,
		get: function () {
			//return this.getDataValue('Date').toString().replace("Z","").replace("T","");
			//return Moment(this.getDataValue('Date')).add(-1, 'hours');//.format().replace("+01:00","Z");
			return Moment(this.getDataValue('Date')).utc().format().replace("Z","+01:00");
		}
	  }
	},{
	  tableName: 'MultiMeter',
	  timestamps: false,
	});
	MultiMeter.removeAttribute('id');
	return MultiMeter;
}
