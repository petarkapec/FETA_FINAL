const izvodjacService = require('../services/izvodjacService');

const getAll = async (req, res) => {
    try {
        const izvodjaci = await izvodjacService.getAll();
        res.json(izvodjaci);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    try {
        const newIzvodjac = await izvodjacService.create(req.body);
        res.status(201).json(newIzvodjac);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getIzvodjacById = async (req, res) => {
    try {
        const { dj_id } = req.params;
        console.log(dj_id);
        console.log("proslo");
        const narudzba = await izvodjacService.getIzvodjacById(dj_id);
        
        res.json(narudzba);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const updateIzvodjac = async (req, res) => {
    try {
        const { dj_id } = req.params; // ID izvođača iz URL-a
        const updatedData = req.body; // Podaci za ažuriranje iz tijela zahtjeva

        const updatedIzvodjac = await izvodjacService.updateIzvodjac(dj_id, updatedData);

        if (!updatedIzvodjac) {
            return res.status(404).json({ message: "Izvođač nije pronađen." });
        }

        res.json(updatedIzvodjac);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAll,
    create,
    getIzvodjacById,
    updateIzvodjac, // Dodano
};