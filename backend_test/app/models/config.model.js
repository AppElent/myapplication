
module.exports = (sequelize, Sequelize) => {
	const Config = sequelize.define('config', {
	  item: {
		type: Sequelize.STRING,
		primaryKey: true
	  },
	  value: {
		type: Sequelize.STRING
	  }
	});
	
	return Config;
}