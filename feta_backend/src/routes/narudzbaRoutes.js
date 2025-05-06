const express = require('express');
const narudzbaController = require('../controllers/narudzbaController');

const router = express.Router();

router.post('/stvori', narudzbaController.createNarudzba);
router.get('/posesiji/:sesija_id', narudzbaController.getNarudzbeBySesijaId);
router.get('/:narudzba_id', narudzbaController.getNarudzbaById);
router.put('/:narudzba_id/status', narudzbaController.updateNarudzbaStatus); // Nova ruta

const stripe = require('stripe')(process.env.STRIPE_SECRET);
const narudzbaService = require('../services/narudzbaService');

router.post('/:id/capture', async (req, res) => {
  const { id } = req.params;

  try {
    const narudzba = await narudzbaService.getNarudzbaById(id);

    if (!narudzba || !narudzba.stripe_payment_intent_id) {
      return res.status(404).json({ error: "Narudžba nije pronađena ili nema PaymentIntent" });
    }

    const paymentIntent = await stripe.paymentIntents.capture(narudzba.stripe_payment_intent_id);

    return res.json({ message: "Plaćanje uspješno naplaćeno", paymentIntent });
  } catch (err) {
    console.error("Stripe capture error:", err);
    return res.status(500).json({ error: "Greška pri naplati" });
  }
});
  

module.exports = router;