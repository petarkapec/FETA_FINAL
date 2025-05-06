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
        console.log(lokacija_id);
        console.log("proslo");
        const narudzba = await lokacijaService.getLokacijaById(lokacija_id);
        
        res.json(narudzba);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
module.exports = {
    searchLocations,
    getLokacijaById,
};