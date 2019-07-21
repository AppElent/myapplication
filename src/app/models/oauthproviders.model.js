const Encryption = require('../classes/Encryption');
const encryption = new Encryption();
const key =  process.env.SEQUELIZE_ENCRYPTION_KEY;


module.exports = (sequelize, Sequelize) => {

	const OauthProviders = sequelize.define('oauthproviders', {
	  id: {
		type: Sequelize.STRING,
		allowNull: false,
		primaryKey: true,
	  },
	  client_id: {
		type: Sequelize.STRING,
		allowNull: false,
		set(val) {
			const encrypted = encryption.encryptString(val, key);
			this.setDataValue('client_id', encrypted.iv + '~' + encrypted.encryptedString);
		},
		get() {
			const val = this.getDataValue('client_id');
			return (val === undefined || val === null) ? null : encryption.decryptString(val.split('~')[1], key, val.split('~')[0])
		}
	  },
	  client_secret: {
		type: Sequelize.STRING,
		allowNull: false,
		set(val) {
			const encrypted = encryption.encryptString(val, key);
			this.setDataValue('client_secret', encrypted.iv + '~' + encrypted.encryptedString);
		},
		get() {
			const val = this.getDataValue('client_secret');
			return (val === undefined || val === null) ? null : encryption.decryptString(val.split('~')[1], key, val.split('~')[0])
		}
	  },
	  idName: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  secretName: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  tokenHost: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  tokenPath: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  revokePath: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  authorizeHost: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  authorizePath: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  bodyFormat: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  authorizationMethod: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  flow: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  redirect_url: {
		type: Sequelize.STRING,
		allowNull: true,
	  },
	  default_scope: {
		type: Sequelize.STRING,
	  }
	},{
	  tableName: 'oauthproviders',
	  allowNull: false,
	});
	return OauthProviders;
}
