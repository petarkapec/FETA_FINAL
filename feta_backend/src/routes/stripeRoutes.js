const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

router.post("/create-payment-intent", stripeController.createPaymentIntent);
router.post("/capture-payment", stripeController.capturePayment);
router.post("/cancel-payment", stripeController.cancelPayment);
const { getIO } = require('../socket'); // Dodano
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const { Narudzba } = require("../models"); // Sequelize model

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.sendStatus(400);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const metadata = intent.metadata;

    try {
      await Narudzba.create({
        sesija_id: metadata.sesija_id,
        user_id: metadata.user_id,
        song_id: metadata.song_id,
        song_name: metadata.song_name,
        song_artist: metadata.song_artist,
        song_album_art: metadata.song_album_art,
        donation: metadata.donation,
        comment: metadata.comment,
        status: "pending",
      });

      getIO().emit('refresh_data', { type: 'stripe_webhook_narudzba' });
      console.log("Narudžba kreirana nakon uplate.");
    } catch (err) {
      console.error("Greška pri kreiranju narudžbe:", err);
    }
  }

  res.status(200).send("OK");
});


router.post("/initiate-payment", async (req, res) => {
    const {
      sesija_id,
      user_id,
      donation,
      song_id,
      song_name,
      song_artist,
      song_album_art,
      comment,
    } = req.body;
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `${song_name} by ${song_artist}`,
                description: `Zahtjev za pjesmu (sesija ${sesija_id})`,
              },
              unit_amount: donation * 100, // u centima
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/payment-confirmed?session_id=${sesija_id}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
        payment_intent_data: {
          capture_method: "manual",
          metadata: {
            sesija_id,
            user_id,
            donation,
            song_id,
            song_name,
            song_artist,
            song_album_art,
            comment,
          },
        },
      });
      console.log("Stripe session created:", session.url);
      console.log(`${process.env.FRONTEND_URL}/payment-confirmed?session_id=${sesija_id}`)
      getIO().emit('refresh_data', { type: 'stripe_webhook_narudzba' });
  
      return res.json({ checkoutUrl: session.url }); // <--- OVO je ispravno!
    } catch (err) {
      console.error("Stripe error:", err);
      return res.status(500).json({ error: "Greška pri generiranju uplate" });
    }
  });
  

module.exports = router;
