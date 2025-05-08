
const Narudzba = require('../models/narudzba');

const createNarudzba = async (narudzbaData) => {
    try {
        const novaNarudzba = await Narudzba.create(narudzbaData);
        return novaNarudzba;
    } catch (error) {
        throw new Error(error.message);
    }
};



const getNarudzbaById = async (narudzba_id) => {
    return await Narudzba.findByPk(narudzba_id);
};

const getAll = async () => {
    return await IzvodjacMuzike.findAll();
};
async function getNarudzbeByKorisnikId(korisnik_id) {
    console.log(korisnik_id);
    try {
        const narudzbe = await Narudzba.findAll({
            where: {
                user_id: korisnik_id
            }
        });
        return narudzbe;
    } catch (error) {
        throw error;
    }
}

async function getNarudzbeBySesijaId(sesija_id) {
    console.log(sesija_id);
    try {
        const narudzbe = await Narudzba.findAll({
            where: {
                sesija_id: sesija_id
            }
        });
        return narudzbe;
    } catch (error) {
        throw error;
    }
}

async function updateNarudzbaStatus (narudzba_id, status, stripeSessionId = null, stripePaymentUrl = null) {
    const updateData = { status };
    console.log("ulazi");

    // Ako je status "allowed", dodajemo Stripe podatke
    if (status === "allowed") {
        updateData.stripe_payment_link = stripePaymentUrl;
    }

    // Ažuriramo narudžbu
    const [updatedRows] = await Narudzba.update(updateData, {
        where: { narudzba_id }
    });

    if (updatedRows === 0) {
        throw new Error("Narudžba nije pronađena ili nije ažurirana.");
    }

    // Vraćamo ažuriranu narudžbu
    return await Narudzba.findByPk(narudzba_id);
};



module.exports = {
    createNarudzba,
    getAll,
    getNarudzbeBySesijaId,
    getNarudzbaById,
    updateNarudzbaStatus,
    getNarudzbeByKorisnikId,
};