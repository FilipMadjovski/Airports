const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airport.controller');
const upload = require('../middlewares/flights.middleware.js');


router.get('/', airportController.get);
router.post('/', airportController.create);
router.post('/csv', upload.single('airports'), airportController.importCsvAirports);
router.get('/most-passengers/:countryName', airportController.getMostPassengers);
router.delete('/:id', airportController.remove);

module.exports = router;
