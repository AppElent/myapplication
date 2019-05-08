

module.exports = (sequelize, Sequelize) => {

	const Apisettings = sequelize.define('apisettings', {
	  id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true,
	  },
	  user: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  name: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  access_token: {
		type: Sequelize.STRING
	  },
	  refresh_token: {
		type: Sequelize.STRING
	  },
	  expires_at: {
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
	  tableName: 'apisettings',
	  allowNull: false,
	});
	return Apisettings;
}
