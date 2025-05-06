const Sesija = require('../models/sesija.js');

async function createSesija(dj_id, lokacija_id, minimal_price, comentary = null, queue_max_song_count = null) {
    return await Sesija.create({
        dj_id,
        lokacija_id,
        minimal_price,
        comentary,
        queue_max_song_count,
    });
}

async function deleteSesija(sesija_id) {
    const sesija = await Sesija.findByPk(sesija_id);
    if (!sesija) {
        throw new Error('Sesija not found');
    }
    await sesija.destroy();
    return { message: 'Sesija deleted successfully' };
}

async function getSesijeByDjId(dj_id) {
    try {
        const sesije = await Sesija.findAll({
            where: {
                dj_id: dj_id
            }
        });
        return sesije;
    } catch (error) {
        throw error;
    }
}

async function getSesijaByLokacijaId(lokacija_id) {
    try {
        const sesija = await Sesija.findAll({
            where: {
                lokacija_id: lokacija_id
            }
        });
        return sesija;
    } catch (error) {
        throw error;
    }
}

async function  getSesijaById(sesija_id) {
    const sesija = await Sesija.findByPk(sesija_id);
    if (!sesija) {
        throw new Error('Sesija not found');
    }
    return sesija;
    
}
module.exports = {
    createSesija,
    deleteSesija,
    getSesijeByDjId,
    getSesijaById,
    getSesijaByLokacijaId,
};