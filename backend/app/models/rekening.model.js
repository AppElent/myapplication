
module.exports = (sequelize, Sequelize) => {
	const Rekening = sequelize.define('rekening', {
	  naam: {
		type: Sequelize.STRING,
		allowNull: false,
	  },
	  user: {
		type: Sequelize.STRING
	  },
	  dag: {
		type: Sequelize.INTEGER
	  },
	  type: {
		type: Sequelize.STRING,
		allowNull: false,
	  },
	  rekening: {
		type: Sequelize.STRING,
		allowNull: false,
	  },
	  month_1: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_2: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_3: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_4: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_5: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_6: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_7: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_8: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_9: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_10: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_11: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  month_12: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  }
	});
	
	return Rekening;
}
