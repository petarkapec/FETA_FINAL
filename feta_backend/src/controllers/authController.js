const authService = require('../services/authService');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Pozovi servis za autentikaciju
        const result = await authService.login(email, password);

        // Vrati token i informacije o izvođaču
        res.status(200).json(result);
    } catch (err) {
        // Uhvati grešku i vrati odgovarajući status i poruku
        res.status(401).json({ message: err.message });
    }
};

module.exports = {
    login,
};