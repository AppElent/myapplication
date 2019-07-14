
var moment = require('moment');

module.exports = (sequelize, Sequelize) => {

	const Event = sequelize.define('events', {
	  datetime: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW,
		get: function () {
			return moment(this.getDataValue('datetime')).tz('Europe/Amsterdam');
		}
	  },
	  user: {
		type: Sequelize.STRING,
		allowNull: false,
	  },
	  value: {
		type: Sequelize.STRING,
		allowNull: false,
	  }
	},{
	  scopes: {
		last_week: {
		  where: {
			datetime: {
				$gte: moment().subtract(7, 'days').toDate(),
			  }
		  }
		}
  }});
	
	return Event;
}
