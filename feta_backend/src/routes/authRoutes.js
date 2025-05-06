const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definirajte POST rutu za login
router.post('/login', authController.login);

module.exports = router;