require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
    },
    jwtSecret: process.env.JWT_SECRET || 'a9521206b8bc53797f7fbce7119b0131',
    stripe_id: process.env.STRIPE_ID, 
    stripe_secret: process.env.STRIPE_SECRET,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
};