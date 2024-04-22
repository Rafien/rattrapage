const Sequelize = require('sequelize');

// Configuration de la connexion à PostgreSQL
const sequelize = new Sequelize('test', '1234', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const models = {
    User: require('./user')(sequelize, Sequelize.DataTypes)
};

module.exports = { sequelize, models };
