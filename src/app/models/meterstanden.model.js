const Moment = require('moment');

module.exports = (sequelize, Sequelize) => {
    const meterstanden = sequelize.define(
        'meterstanden',
        {
            datetime: {
                type: Sequelize.DATE,
                get: function() {
                    return Moment(this.getDataValue('datetime')).tz('Europe/Amsterdam'); //.format('YYYY-MM-DD HH:mm:ss');
                },
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            180: {
                type: Sequelize.STRING,
            },
            181: {
                type: Sequelize.STRING,
            },
            182: {
                type: Sequelize.STRING,
            },
            280: {
                type: Sequelize.STRING,
            },
            281: {
                type: Sequelize.STRING,
            },
            282: {
                type: Sequelize.STRING,
            },
        },
        {
            tableName: 'meterstanden',
        },
    );

    return meterstanden;
};
