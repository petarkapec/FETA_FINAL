const { IzvodjacMuzike } = require('../models');

const getAll = async () => {
    return await IzvodjacMuzike.findAll();
};

const create = async (data) => {
    return await IzvodjacMuzike.create(data);
};

const getIzvodjacById = async (dj_id) => {
    return await IzvodjacMuzike.findByPk(dj_id);
};

const updateIzvodjac = async (dj_id, updatedData) => {
    // Pronađi izvođača prema ID-u
    const izvodjac = await IzvodjacMuzike.findByPk(dj_id);

    if (!izvodjac) {
        return null; // Ako izvođač ne postoji, vrati null
    }

    // Ažuriraj izvođača s novim podacima
    await izvodjac.update(updatedData);

    return izvodjac; // Vrati ažuriranog izvođača
};

module.exports = {
    getAll,
    create,
    getIzvodjacById,
    updateIzvodjac, // Dodano
};