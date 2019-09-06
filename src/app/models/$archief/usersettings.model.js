

module.exports = (sequelize, Sequelize) => {

	const Usersettings = sequelize.define('usersettings', {
	  id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true,
	  },
	  userId: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  setting: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  access_token: {
		type: Sequelize.STRING
	  },
	  refresh_token: {
		type: Sequelize.STRING
	  },
	  success: {
		type: Sequelize.BOOLEAN
	  },
	  data1: {
		type: Sequelize.STRING
	  },
	  data2: {
		type: Sequelize.STRING
	  },
	  data3: {
		type: Sequelize.STRING
	  },
	  data4: {
		type: Sequelize.STRING
	  },
	  data5: {
		type: Sequelize.STRING
	  },
	  data6: {
		type: Sequelize.STRING
	  },
	  data7: {
		type: Sequelize.STRING
	  },
	  data8: {
		type: Sequelize.STRING
	  },
	  data9: {
		type: Sequelize.STRING
	  },
	  data10: {
		type: Sequelize.STRING
	  }
	},{
	  tableName: 'usersettings',
	  allowNull: false,
	});
	return Usersettings;
}
