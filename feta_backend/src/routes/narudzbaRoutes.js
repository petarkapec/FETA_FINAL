const express = require('express');
const narudzbaController = require('../controllers/narudzbaController');
const narudzbaService = require('../services/narudzbaService');
const { getIO } = require('../socket'); // Dodano
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const router = express.Router();

router.post('/stvori', async (req, res) => {
  await narudzbaController.createNarudzba(req, res);
  getIO().emit('refresh_data', { type: 'narudzba_stvorena' });
});

router.get('/posesiji/:sesija_id', narudzbaController.getNarudzbeBySesijaId);

router.get('/:narudzba_id', narudzbaController.getNarudzbaById);

router.put('/:narudzba_id/status', async (req, res) => {
  await narudzbaController.updateNarudzbaStatus(req, res);
  getIO().emit('refresh_data', { type: 'narudzba_status_azuriran' });
});

router.get('/korisnik/:korisnik_id', narudzbaController.getNarudzbeByKorisnikId);

router.post('/:id/capture', async (req, res) => {
  const { id } = req.params;

  try {
    const narudzba = await narudzbaService.getNarudzbaById(id);

    if (!narudzba || !narudzba.stripe_payment_intent_id) {
      return res.status(404).json({ error: "Narudžba nije pronađena ili nema PaymentIntent" });
    }

    const paymentIntent = await stripe.paymentIntents.capture(narudzba.stripe_payment_intent_id);

    getIO().emit('refresh_data', { type: 'stripe_capture' });

    return res.json({ message: "Plaćanje uspješno naplaćeno", paymentIntent });
  } catch (err) {
    console.error("Stripe capture error:", err);
    return res.status(500).json({ error: "Greška pri naplati" });
  }
});

module.exports = router;
