const sequelize = require('../config/database');
const IzvodjacMuzike = require('./izvodjacMuzike');
const Lokacija = require('./lokacija');
const Sesija = require('./sesija');
const Narudzba = require('./narudzba');
const User = require('./user')(sequelize);

// Definirajte veze između modela
IzvodjacMuzike.hasMany(Sesija, { foreignKey: 'dj_id' });
Sesija.belongsTo(IzvodjacMuzike, { foreignKey: 'dj_id' });

Lokacija.hasMany(Sesija, { foreignKey: 'lokacija_id' });
Sesija.belongsTo(Lokacija, { foreignKey: 'lokacija_id' });

Sesija.hasMany(Narudzba, { foreignKey: 'sesija_id' });
Narudzba.belongsTo(Sesija, { foreignKey: 'sesija_id' });

User.hasMany(Narudzba, { foreignKey: 'user_id' });
Narudzba.belongsTo(User, { foreignKey: 'user_id' });

// Sinkronizirajte modele s bazom podataka
sequelize.sync()
    .then(() => console.log('Tabele sinkronizirane.'))
    .catch(err => console.error('Greška pri sinkronizaciji:', err));

module.exports = {
    IzvodjacMuzike,
    Lokacija,
    Sesija,
    Narudzba,
    User,
};