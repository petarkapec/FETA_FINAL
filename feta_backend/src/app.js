const express = require('express');
const config = require('./config/env');
require('dotenv').config();
console.log(process.env.STRIPE_SECRET);
const authRoutes = require('./routes/authRoutes');
const cors = require('cors'); // Uvoz cors middleware-a
const lokacijaRoutes = require('./routes/lokacijaRoutes');
const sesijaRoutes = require('./routes/sesijaRoutes');
const narudzbaRoutes = require('./routes/narudzbaRoutes');
const bodyParser = require("body-parser");
const userRoutes = require('./routes/userRoutes');
const { v4: uuidv4 } = require('uuid');
const { User } = require('./models');
const stripeRoutes =  require('./routes/stripeRoutes');
const app = express();
const narudzbaService = require("./services/narudzbaService"); // Sequelize model


app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));



// Osnovna ruta
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const indexRoutes = require('./routes/index');
const izvodjacRoutes = require('./routes/izvodjacRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

app.use((req, res, next) => {
    if (req.path === "/stripe-webhook") {
      next(); // Preskoči globalni parser za ovu rutu
    } else {
      express.json()(req, res, next); // Parsiraj JSON za sve ostale rute
    }
  });


  app.post("/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
    
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.sendStatus(400);
  }

 

  if (event.type === "payment_intent.created") {
    const intent = event.data.object;
    const metadata = intent.metadata;


    try {
      await narudzbaService.createNarudzba({
        sesija_id: metadata.sesija_id,
        user_id: metadata.user_id,
        song_id: metadata.song_id,
        song_name: metadata.song_name,
        song_artist: metadata.song_artist,
        song_album_art: metadata.song_album_art,
        donation: metadata.donation,
        comment: metadata.comment,
        status: "pending",
        stripe_payment_intent_id: intent.id,
      });

      console.log("Narudžba kreirana nakon uplate.");
    } catch (err) {
      console.error("Greška pri kreiranju narudžbe:", err);
    }
  }

  res.status(200).send("OK");
});






app.use('/', indexRoutes);
//app.use('/Izvodjaci', authMiddleware)


// login

app.post('/login', async (req, res) => {
    const { nickname } = req.body;
    const token = uuidv4();
  
    try {
      const user = await User.create({ nickname, token });
      res.json({ token: user.token, nickname: user.nickname, user_id:user.user_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Greška kod logina' });
    }
  });
  
  app.get('/me', async (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) return res.status(400).json({ error: 'Token nedostaje' });
  
    const user = await User.findOne({ where: { token } });
  
    if (!user) return res.status(401).json({ message: 'Nevažeći token' });
  
    res.json({ nickname: user.nickname, userid: user.user_id });
  });


  app.use('/izvodjaci', izvodjacRoutes);

app.use('/sesije', sesijaRoutes);

app.use('/narudzbe', narudzbaRoutes);

app.use('/lokacije', lokacijaRoutes);

app.use('/auth', authRoutes);

app.use('/stripe', stripeRoutes);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});

module.exports = app;