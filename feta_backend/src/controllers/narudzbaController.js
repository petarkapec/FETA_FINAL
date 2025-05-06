const narudzbaService = require('../services/narudzbaService');

const stripe = require('stripe')(process.env.STRIPE_SECRET);

const createNarudzba = async (req, res) => {
    const {
      sesija_id,
      user_id,
      comment,
      donation,
      song_id,
      song_name,
      song_artist,
      song_album_art,
      status,
    } = req.body;
  
    try {
      // 1. Stripe PaymentIntent s manual capture
      const paymentIntent = await stripe.paymentIntents.create({
        amount: donation * 100,
        currency: "eur",
        capture_method: "manual",
        metadata: {
          user_id,
          song_id,
          sesija_id,
        },
      });
  
      // 2. Stripe payment link
      const paymentLink = `https://checkout.stripe.com/pay/${paymentIntent.client_secret}`;
  
      // 3. Spremi narudžbu kroz Sequelize service
      const narudzba = await narudzbaService.createNarudzba({
        sesija_id,
        user_id,
        comment,
        donation,
        song_id,
        song_name,
        song_artist,
        song_album_art,
        status,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_payment_link: paymentLink,
      });
  
      return res.status(201).json({
        message: "Narudžba stvorena",
        narudzba_id: narudzba.narudzba_id,
        stripe_payment_link: paymentLink,
      });
  
    } catch (err) {
      console.error("Stripe greška:", err);
      return res.status(500).json({ error: "Greška pri kreiranju narudžbe" });
    }
  };

const updateNarudzbaStatus = async (req, res) => {
    const { narudzba_id } = req.params;
    const { status } = req.body;

    try {
        // Ako je status "allowed", kreiramo Stripe payment link
        if (status === "allowed") {
            // Dohvaćamo narudžbu iz baze
            const narudzba = await narudzbaService.getNarudzbaById(narudzba_id);

            // Kreiranje Stripe payment linka
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Donacija',
                        },
                        unit_amount: narudzba.donation * 100, // amount u centima
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/narudzba/${narudzba_id}`,
                cancel_url: `${process.env.FRONTEND_URL}/narudzba/${narudzba_id}`,
                metadata: {
                    narudzba_id: narudzba_id
                }
            });

            // Ažuriramo narudžbu sa statusom "allowed" i Stripe payment linkom
            const updatedNarudzba = await narudzbaService.updateNarudzbaStatus(narudzba_id, status, session.id, session.url);
            return res.status(200).json(updatedNarudzba);
        }

        // Ako status nije "allowed", samo ažuriramo status
        const updatedNarudzba = await narudzbaService.updateNarudzbaStatus(narudzba_id, status);
        return res.status(200).json(updatedNarudzba);

    } catch (error) {
        console.error("Greška u kontroleru:", error);
        return res.status(400).json({ message: error.message });
    }
};



const getAll = async (req, res) => {
    try {
        const narudzbe = await narudzbaService.getAll();
        res.json(narudzbe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getNarudzbaById = async (req, res) => {
    try {
        const { narudzba_id } = req.params;
        console.log(narudzba_id);
        console.log("proslo");
        const narudzba = await narudzbaService.getNarudzbaById(narudzba_id);
        
        res.json(narudzba);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


async function getNarudzbeBySesijaId(req, res) {
    const { sesija_id } = req.params;

    try {
        const narudzbe = await narudzbaService.getNarudzbeBySesijaId(sesija_id);
        res.status(200).json(narudzbe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createNarudzba,
    getAll,
    getNarudzbeBySesijaId,
    getNarudzbaById,
    updateNarudzbaStatus,
};