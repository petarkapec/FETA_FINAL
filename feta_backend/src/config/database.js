const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'FetaLumen',
    port:process.env.DB_PORT || '5432',
    logging: false, // Onemogući SQL logove u konzoli
});

module.exports = sequelize; // Eksportajte sequelize instancu