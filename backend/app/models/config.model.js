
module.exports = (sequelize, Sequelize) => {
	const Config = sequelize.define('config', {
	  item: {
		type: Sequelize.STRING
	  },
	  value: {
		type: Sequelize.STRING
	  }
	});
	
	return Config;
}