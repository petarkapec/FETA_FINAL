const lokacijaService = require('../services/lokacijaService');

async function searchLocations(req, res) {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    try {
        const locations = await lokacijaService.searchLocations(query);
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLokacijaById = async (req, res) => {
    try {
        const { lokacija_id } = req.params;
        
        const narudzba = await lokacijaService.getLokacijaById(lokacija_id);
        
        res.json(narudzba);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getAll = async (req, res) => {
    try {
        const lokacije = await lokacijaService.getAll();
        res.json(lokacije);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = {
    getAll,
    searchLocations,
    getLokacijaById,
};