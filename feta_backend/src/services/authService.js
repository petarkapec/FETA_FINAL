const bcrypt = require('bcrypt');
const { IzvodjacMuzike } = require('../models');
const { generateToken } = require('../utils/jwt');

const login = async (email, password) => {
    // Pronađi izvođača po email-u
    const izvodjac = await IzvodjacMuzike.findOne({ where: { email } });

    // Ako izvođač ne postoji, baci grešku
    if (!izvodjac) {
        throw new Error('ne postoji lik');
    }

    // Provjeri lozinku
    const isPasswordValid = password === izvodjac.password;


    // Ako lozinka nije ispravna, baci grešku
    if (!isPasswordValid) {
        throw new Error('Neispravan email ili lozinka.');
    }

    // Generiraj JWT token
    const token = generateToken(izvodjac);

    // Vrati token i informacije o izvođaču
    return {
        token,
        izvodjac: {
            dj_id: izvodjac.dj_id,
            ime: izvodjac.ime,
            prezime: izvodjac.prezime,
            email: izvodjac.email,
            about_me: izvodjac.about_me,
            datum_rodjenja: izvodjac.datum_rodjenja,
            profilna_slika: izvodjac.profilna_slika,
            oib: izvodjac.oib,
            iban: izvodjac.iban,
            instagram: izvodjac.instagram,
        },
    };
};

module.exports = {
    login,
};