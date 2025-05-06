const Lokacija = require('../models/lokacija.js');

const { Op } = require('sequelize');

async function searchLocations(query) {
    return await Lokacija.findAll({
        where: {
            [Op.or]: [
                { naziv_kluba: { [Op.iLike]: `%${query}%` } },
                { adresa: { [Op.iLike]: `%${query}%` } },
                { email: { [Op.iLike]: `%${query}%` } },
                { broj_telefona: { [Op.iLike]: `%${query}%` } }
            ]
        },
        limit: 10
    });
}

const getLokacijaById = async (lokacija_id) => {
    return await Lokacija.findByPk(lokacija_id);
};

module.exports = {
    searchLocations,
    getLokacijaById,
};