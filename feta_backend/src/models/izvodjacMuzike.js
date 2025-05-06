const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IzvodjacMuzike = sequelize.define('IzvodjacMuzike', {
    dj_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ime: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    prezime: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    oib: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    datum_rodjenja: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    adresa: {
        type: DataTypes.STRING(100),
    },
    profilna_slika: {
        type: DataTypes.STRING(255),
    },
    iban: {
        type: DataTypes.STRING(34),
        allowNull: false,
        unique: true,
    },
    google_user_id: {
        type: DataTypes.STRING(255),
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    about_me: {
        type: DataTypes.TEXT,
    },
    instagram: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    }
}, {
    tableName: 'izvodjac_muzike',
    timestamps: false, // Ako ne koristite `createdAt` i `updatedAt`
});

module.exports = IzvodjacMuzike;