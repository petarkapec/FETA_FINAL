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

module.exports = {
    getAll,
    create,
    getIzvodjacById,
};