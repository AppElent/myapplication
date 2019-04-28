

module.exports = (sequelize, Sequelize) => {

	const Usersettings = sequelize.define('usersettings', {
	  id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true,
	  },
	  user: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  setting: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  data: {
		type: Sequelize.STRING,
		allowNull: false
	  }
	},{
	  tableName: 'usersettings',
	  allowNull: false,
	});
	return Usersettings;
}
