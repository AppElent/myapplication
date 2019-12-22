module.exports = (sequelize, Sequelize) => {
    const Config = sequelize.define(
        'config',
        {
            item: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            user: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            value: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'config',
            allowNull: false,
        },
    );

    return Config;
};
