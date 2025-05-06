const sesijaService = require('../services/sesijaService');
const Sesija = require('../models/sesija');
const { Op } = require('sequelize');

async function createSesija(req, res) {
    const { dj_id, lokacija_id, minimal_price, comentary, queue_max_song_count } = req.body;

    // Provjera obaveznih polja
    if (!dj_id || !lokacija_id || minimal_price === undefined) {
        return res.status(400).json({ message: 'dj_id, lokacija_id, and minimal_price are required' });
    }

    try {
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 12);
        const expiration = expirationDate.toISOString();

        const novaSesija = await Sesija.create({
            dj_id,
            lokacija_id,
            minimal_price,
            comentary,
            queue_max_song_count,
            expiration,
            status: 'active' // Postavi status na 'active'
        });

        res.status(201).json(novaSesija);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteSesija(req, res) {
    const { sesija_id } = req.params;

    if (!sesija_id) {
        return res.status(400).json({ message: 'sesija_id is required' });  
    }

    try {
        const result = await sesijaService.deleteSesija(sesija_id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Sesija not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

async function getSesijaById(req, res) {
    const { sesija_id } = req.params;

    if (!sesija_id) {
        return res.status(400).json({ message: 'sesija_id is required' });
    }

    try {
        const result = await sesijaService.getSesijaById(sesija_id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Sesija not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

async function getSesijeByDjId(req, res) {
    const { dj_id } = req.params;

    try {
        const sesije = await sesijaService.getSesijeByDjId(dj_id);
        res.status(200).json(sesije);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getSesijaByLokacijaId(req, res) {
    const { lokacija_id } = req.params;

    try {
        const sesija = await sesijaService.getSesijaByLokacijaId(lokacija_id);
        res.status(200).json(sesija);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getActiveSesija(req, res) {
    const { dj_id } = req.params;

    try {
        const activeSesija = await Sesija.findOne({
            where: {
                dj_id,
                status: 'active' // Provjeri da li je status 'active'
            }
        });

        if (activeSesija) {
            res.json(activeSesija);
        } else {
            res.status(404).json({ message: 'No active session found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createSesija,
    deleteSesija,
    getSesijeByDjId,
    getSesijaById,
    getSesijaByLokacijaId,
    getActiveSesija,
};