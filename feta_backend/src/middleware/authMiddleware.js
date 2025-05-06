const jwt = require("../utils/jwt.js")
const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization"); // Čitamo token iz zaglavlja


    if (!token) {
        return res.status(401).json({ message: "Pristup odbijen. Nema tokena." });
    }

    try {
        const decoded = verifyToken(token.replace("Bearer ", ""), "tajni_kljuc"); // Dekodiraj token
        console.log(decoded);
        req.user = decoded; // Dodaj korisnika u `req` objekt, da ga možemo koristiti u rutama
        next(); // Nastavi dalje
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ message: "Neispravan ili istekao token." });
    }
};

module.exports = authMiddleware;
