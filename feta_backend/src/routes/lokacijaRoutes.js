const express = require('express');
const lokacijaController = require('../controllers/lokacijaController');

const router = express.Router();

router.get('/search', lokacijaController.searchLocations);
router.get('/all', lokacijaController.getAll);
router.get('/:lokacija_id', lokacijaController.getLokacijaById);


module.exports = router;