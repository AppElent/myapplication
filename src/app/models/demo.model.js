
var moment = require('moment');

module.exports = (sequelize, Sequelize) => {

	const Demo = sequelize.define('demo', {
	  datetime: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW,
		get: function () {
			return moment(this.getDataValue('datetime')).tz('Europe/Amsterdam');
		}
	  },
	  userId: {
		type: Sequelize.STRING,
		allowNull: false,
	  },
	  value: {
		type: Sequelize.STRING,
		allowNull: false,
	  }
	}
 );
	
	return Demo;
}
