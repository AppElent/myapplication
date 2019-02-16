
module.exports = (sequelize, Sequelize) => {
	const Rekening = sequelize.define('rekening', {
	  naam: {
		type: Sequelize.STRING,
		allowNull: false,
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
	  januari: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  februari: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  maart: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  april: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  mei: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  juni: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  juli: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  augustus: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  september: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  oktober: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  november: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  },
	  december: {
		type: Sequelize.INTEGER,
		allowNull: false,
	  }
	});
	
	return Rekening;
}