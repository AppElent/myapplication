//import { encryption } from '../modules/Encryption';
import Encryption from 'simple-encrypt-js';
const encryption = new Encryption();
const key = process.env.SEQUELIZE_ENCRYPTION_KEY;

module.exports = (sequelize, Sequelize) => {
    const Bunq = sequelize.define(
        'bunq',
        {
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            access_token: {
                type: Sequelize.STRING(10000),
                set(val) {
                    //const encrypted = encryption.encryptString(val, key);
                    //this.setDataValue('access_token', encrypted.iv + '~' + encrypted.encryptedString);
                    this.setDataValue('access_token', encryption.getEncryptionString(val, key));
                },
                get() {
                    //const val = this.getDataValue('access_token');
                    //return (val === undefined || val === null) ? null : encryption.decryptString(val.split('~')[1], key, val.split('~')[0])
                    return encryption.getEncryptionValue(this.getDataValue('access_token'), key);
                },
            },
            encryption_key: {
                type: Sequelize.STRING(10000),
                set(val) {
                    this.setDataValue('encryption_key', encryption.getEncryptionString(val, key));
                },
                get() {
                    return encryption.getEncryptionValue(this.getDataValue('encryption_key'), key);
                },
            },
            environment: {
                type: Sequelize.STRING,
            },
        },
        {
            tableName: 'bunq',
            allowNull: false,
            // disable the modification of table names; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true,
        },
    );
    return Bunq;
};
