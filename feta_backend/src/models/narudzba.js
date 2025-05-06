const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Narudzba = sequelize.define('Narudzba', {
    narudzba_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sesija_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sesija',
            key: 'sesija_id',
        },
        onDelete: 'CASCADE',
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'user',
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    comment: {
        type: DataTypes.TEXT,
    },
    donation: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
        },
    },
    song_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    song_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    song_artist: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    song_album_art: {
        type: DataTypes.STRING(255),
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    stripe_payment_link: {
        type: DataTypes.STRING(1024),
        allowNull: true,
    },
    stripe_payment_intent_id: {
        type: DataTypes.STRING(1024),
        allowNull: true,
    },
}, {
    tableName: 'narudzba',
    timestamps: true, // Koristi `createdAt` za `created_at`
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = Narudzba;