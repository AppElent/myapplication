
module.exports = (sequelize, Sequelize) => {
	const Event = sequelize.define('events', {
	  datetime: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	  },
	  value: {
		type: Sequelize.STRING
	  }
	});
	
	return Event;
}