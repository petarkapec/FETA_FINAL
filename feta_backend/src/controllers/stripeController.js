const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  const { amount, songName, artist, userId, sessionId, comment } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: "eur",
      capture_method: "manual",
      description: `Narudžba pjesme: ${songName} - ${artist}`,
      metadata: {
        song_name: songName,
        artist,
        user_id: userId,
        session_id: sessionId,
        comment,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).send({ error: "Stripe greška" });
  }
};

exports.capturePayment = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    await stripe.paymentIntents.capture(paymentIntentId);
    res.send({ success: true });
  } catch (err) {
    console.error("Capture error:", err);
    res.status(500).send({ error: "Greška pri naplati" });
  }
};

exports.cancelPayment = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    await stripe.paymentIntents.cancel(paymentIntentId);
    res.send({ success: true });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).send({ error: "Greška pri otkazivanju" });
  }
};
