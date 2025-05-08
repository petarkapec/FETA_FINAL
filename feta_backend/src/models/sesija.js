const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sesija = sequelize.define('Sesija', {
    sesija_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dj_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'izvodjac_muzike',
            key: 'dj_id',
        },
        onDelete: 'CASCADE',
    },
    lokacija_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'lokacija',
            key: 'lokacija_id',
        },
        onDelete: 'SET NULL',
    },
    expiration: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    minimal_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    comentary: {
        type: DataTypes.TEXT,
    },
    queue_max_song_count: {
        type: DataTypes.INTEGER,
    },
    naziv: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'naziv' // Default status je 'aktivan'
    },
    zarada: {
        type: DataTypes.INTEGER,
        defaultValue: 0 
    },
    list_link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    list_bool: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
    }
}, {
    tableName: 'sesija',
    timestamps: false,
});

module.exports = Sesija;