const express = require('express');
const sesijaController = require('../controllers/sesijaController');

const router = express.Router();

router.post('/novasesija', sesijaController.createSesija);
router.delete('/:sesija_id', sesijaController.deleteSesija);
router.get('/sesije-dj/:dj_id', sesijaController.getSesijeByDjId);
router.get('/sesije-lokacija/:lokacija_id', sesijaController.getSesijaByLokacijaId);
router.get('/:sesija_id', sesijaController.getSesijaById);
router.get('/active/:dj_id', sesijaController.getActiveSesija);

module.exports = router;