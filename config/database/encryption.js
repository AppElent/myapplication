require('dotenv').config();
const key =  process.env.SEQUELIZE_ENCRYPTION_KEY;
const Encryption = require('../../src/app/modules/Encryption');
const encryption = new Encryption();

module.exports.encryptString = (val) => {
	const encrypted = encryption.encryptString(val, key);
	const encryptedval = encrypted.iv + '~' + encrypted.encryptedString;
	return encryptedval;
}
