const express = require('express');
const router = express.Router();
const izvodjacController = require('../controllers/izvodjacController');
const authMiddleware = require('../middleware/authMiddleware.js');


router.get('/', izvodjacController.getAll);
router.get('/:dj_id', izvodjacController.getIzvodjacById);
router.post('/', izvodjacController.create);
router.put('/:dj_id', izvodjacController.updateIzvodjac);




module.exports = router;