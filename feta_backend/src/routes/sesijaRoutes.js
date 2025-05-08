const express = require('express');
const sesijaController = require('../controllers/sesijaController');
const { getIO } = require('../socket'); // Dodano

const router = express.Router();

router.post('/novasesija', async (req, res) => {
  await sesijaController.createSesija(req, res);
  getIO().emit('refresh_data', { type: 'nova_sesija' });
});

router.delete('/:sesija_id', async (req, res) => {
  await sesijaController.deleteSesija(req, res);
  getIO().emit('refresh_data', { type: 'sesija_obrisana' });
});

router.get('/sesije-dj/:dj_id', sesijaController.getSesijeByDjId);
router.get('/sesije-lokacija/:lokacija_id', sesijaController.getSesijaByLokacijaId);
router.get('/:sesija_id', sesijaController.getSesijaById);
router.get('/active/:dj_id', sesijaController.getActiveSesija);

router.post('/finish/:sesija_id', async (req, res) => {
  await sesijaController.finishSesija(req, res);
  getIO().emit('refresh_data', { type: 'sesija_zavrsena' });
});

module.exports = router;
