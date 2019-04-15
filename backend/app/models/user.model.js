
var moment = require('moment');

module.exports = (sequelize, Sequelize) => {

	const User = sequelize.define('users', {
	  uid: {
		type: Sequelize.STRING,
		unique: true
	  },
	  email: {
		type: Sequelize.STRING
	  },
	  access_level: {
		type: Sequelize.INTEGER
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
	
	return User;
}
