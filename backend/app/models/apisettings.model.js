const Encryption = require('../classes/Encryption');
const encryption = new Encryption();
const key =  process.env.SEQUELIZE_ENCRYPTION_KEY;

module.exports = (sequelize, Sequelize) => {

	const Apisettings = sequelize.define('apisettings', {
	  id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true,
	  },
	  user: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: 'USERxNAME'
	  },
	  name: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: 'USERxNAME'
	  },
	  access_token: {
		type: Sequelize.STRING,
		set(val) {
			const encrypted = encryption.encryptString(val, key);
			this.setDataValue('access_token', encrypted.iv + '~' + encrypted.encryptedString);
		},
		get() {
			const val = this.getDataValue('access_token');
			return encryption.decryptString(val.split('~')[1], key, val.split('~')[0])
		}
	  },
	  refresh_token: {
		type: Sequelize.STRING,
		set(val) {
			const encrypted = encryption.encryptString(val, key);
			this.setDataValue('refresh_token', encrypted.iv + '~' + encrypted.encryptedString);
		},
		get() {
			const val = this.getDataValue('refresh_token');
			return encryption.decryptString(val.split('~')[1], key, val.split('~')[0])
		}
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
