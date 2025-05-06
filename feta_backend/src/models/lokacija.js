const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lokacija = sequelize.define('Lokacija', {
    lokacija_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    profil_slika_link: {
        type: DataTypes.STRING(255),
    },
    facebook: {
        type: DataTypes.STRING(70),
    },
    instagram: {
        type: DataTypes.STRING(70),
    },
    twitter: {
        type: DataTypes.STRING(70),
    },
    about_us: {
        type: DataTypes.TEXT,
    },
    adresa: {
        type: DataTypes.STRING(100),
    },
    email: {
        type: DataTypes.STRING(100),
    },
    broj_telefona: {
        type: DataTypes.STRING(20),
    },
    naziv_kluba: {
        type: DataTypes.STRING(50),
    }
}, {
    tableName: 'lokacija',
    timestamps: false,
});

module.exports = Lokacija;