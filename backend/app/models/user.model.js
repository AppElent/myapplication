
var moment = require('moment');

module.exports = (sequelize, Sequelize) => {

	const User = sequelize.define('users', {
	  id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true,
	  },
	  firstname: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  lastname: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  email: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  access_level: {
		type: Sequelize.INTEGER,
		allowNull: false
	  },
	  options: {
		type: Sequelize.STRING
	  }
	},{
	  tableName: 'users',
	  allowNull: false,
	  scopes: {
		last_week: {
		  where: {
			datetime: {
				$gte: moment().subtract(7, 'days').toDate(),
			  }
		  }
		}
  }});
	//User.removeAttribute('id');
	return User;
}
