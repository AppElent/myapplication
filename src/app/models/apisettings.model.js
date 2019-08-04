const Encryption = require('../modules/Encryption');
const encryption = new Encryption();
const key =  process.env.SEQUELIZE_ENCRYPTION_KEY;


module.exports = (sequelize, Sequelize) => {

	const Apisettings = sequelize.define('apisettings', {
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
		type: Sequelize.STRING(10000),
		set(val) {
			//const encrypted = encryption.encryptString(val, key);
			//this.setDataValue('access_token', encrypted.iv + '~' + encrypted.encryptedString);
			this.setDataValue('access_token', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			//const val = this.getDataValue('access_token');
			//return (val === undefined || val === null) ? null : encryption.decryptString(val.split('~')[1], key, val.split('~')[0])
			return (encryption.getStoredEncryptionValue(this.getDataValue('access_token'), key));
		}
	  },
	  refresh_token: {
		type: Sequelize.STRING(10000),
		set(val) {
			//const encrypted = encryption.encryptString(val, key);
			//this.setDataValue('refresh_token', encrypted.iv + '~' + encrypted.encryptedString);
			this.setDataValue('refresh_token', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			//const val = this.getDataValue('refresh_token');
			//return (val === undefined || val === null) ? null : encryption.decryptString(val.split('~')[1], key, val.split('~')[0])
			return (encryption.getStoredEncryptionValue(this.getDataValue('refresh_token'), key));
		}
	  },
	  expires_at: {
		type: Sequelize.DATE
	  },
	  token_type: {
		type: Sequelize.STRING
	  },
	  scope: {
		type: Sequelize.STRING
	  },	  
	  success: {
		type: Sequelize.BOOLEAN
	  },
	  data1: {
		type: Sequelize.STRING(10000),
		set(val) {
			this.setDataValue('data1', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			return (encryption.getStoredEncryptionValue(this.getDataValue('data1'), key));
		}
	  },
	  data2: {
		type: Sequelize.STRING(10000),
		set(val) {
			this.setDataValue('data2', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			return (encryption.getStoredEncryptionValue(this.getDataValue('data2'), key));
		}
	  },
	  data3: {
		type: Sequelize.STRING(10000),
		set(val) {
			this.setDataValue('data3', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			return (encryption.getStoredEncryptionValue(this.getDataValue('data3'), key));
		}
	  },
	  data4: {
		type: Sequelize.STRING(10000),
		set(val) {
			this.setDataValue('data4', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			return (encryption.getStoredEncryptionValue(this.getDataValue('data4'), key));
		}
	  },
	  data5: {
		type: Sequelize.STRING(10000),
		set(val) {
			this.setDataValue('data5', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			return (encryption.getStoredEncryptionValue(this.getDataValue('data5'), key));
		}
	  },
	  data6: {
		type: Sequelize.STRING(10000),
		set(val) {
			this.setDataValue('data6', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			return (encryption.getStoredEncryptionValue(this.getDataValue('data6'), key));
		}
	  },
	  data7: {
		type: Sequelize.STRING(10000),
		set(val) {
			this.setDataValue('data7', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			return (encryption.getStoredEncryptionValue(this.getDataValue('data7'), key));
		}
	  },
	  data8: {
		type: Sequelize.STRING(10000),
		set(val) {
			this.setDataValue('data8', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			return (encryption.getStoredEncryptionValue(this.getDataValue('data8'), key));
		}
	  },
	  data9: {
		type: Sequelize.STRING(10000),
		set(val) {
			this.setDataValue('data9', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			return (encryption.getStoredEncryptionValue(this.getDataValue('data9'), key));
		}
	  },
	  data10: {
		type: Sequelize.STRING(10000),
		set(val) {
			this.setDataValue('data10', encryption.setStoredEncryptionValue(val, key));
		},
		get() {
			return (encryption.getStoredEncryptionValue(this.getDataValue('data10'), key));
		}
	  }
	},{
	  tableName: 'apisettings',
	  allowNull: false,
	// disable the modification of table names; By default, sequelize will automatically
	// transform all passed model names (first parameter of define) into plural.
	// if you don't want that, set the following
	freezeTableName: true,
	});
	return Apisettings;
}
