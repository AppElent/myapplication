const moment = require('moment-timezone');

module.exports = (sequelize, Sequelize) => {
    const MultiMeter = sequelize.define(
        'MultiMeter',
        {
            DeviceRowID: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            181: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: 'Value1',
            },
            281: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: 'Value2',
            },
            Value3: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Value4: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            182: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: 'Value5',
            },
            282: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: 'Value6',
            },
            Date: {
                type: Sequelize.STRING,
                allowNull: false,
                get: function() {
                    //return this.getDataValue('Date').toString().replace("Z","").replace("T","");
                    //return Moment(this.getDataValue('Date')).add(-1, 'hours');//.format().replace("+01:00","Z");
                    return moment.tz(
                        moment(this.getDataValue('Date'))
                            .utc()
                            .format('YYYY-MM-DD HH:mm:ss'),
                        'Europe/Amsterdam',
                    );
                    //return moment.tz();
                },
            },
        },
        {
            tableName: 'MultiMeter',
            timestamps: false,
        },
    );
    MultiMeter.removeAttribute('id');
    return MultiMeter;
};
