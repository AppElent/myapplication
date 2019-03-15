
var Moment = require('moment');

module.exports = (sequelize, Sequelize) => {

	const Event = sequelize.define('events', {
	  datetime: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW,
		get: function () {
			return Moment(this.getDataValue('datetime')).tz('Europe/Amsterdam').format('YYYY-MM-DD HH:mm:ss');
		}
	  },
	  value: {
		type: Sequelize.STRING
	  }
	});
	
	return Event;
}
