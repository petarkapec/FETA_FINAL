const jwt = require('jsonwebtoken');
const config = require('../config/env');


// Generiraj JWT token
const generateToken = (user) => {
    console.log(config.jwtSecret);
    return jwt.sign(
        { dj_id: user.dj_id, email: user.email }, // Payload
        config.jwtSecret, // Tajni ključ
        { expiresIn: '24h' } // Token ističe za 24 sata
    );
};

// Provjeri JWT token
const verifyToken = (token) => {
    console.log(config.jwtSecret);
    return jwt.verify(token, config.jwtSecret);
};

module.exports = {
    generateToken,
    verifyToken,
};