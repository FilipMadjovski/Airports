const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight.controller');
const upload = require('../middlewares/flights.middleware');

router.get('/', flightController.get);
router.get('/from/:airportCode/to/:destinationCode', flightController.directFlightFromAtoB);
router.get('/from/:airportCode', flightController.directFlightFrom);
router.get('/from/:airportCode', flightController.directFlightTo);
router.post('/', flightController.create);
router.post('/csv', upload.single('flights'), flightController.importCsvFlights);
router.put('/:id', flightController.update);

module.exports = router;
