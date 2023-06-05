const flights = require('../services/flights.services');


async function get(req, res, next) {
  try {
    res.json(await flights.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting flights`, err.message);
    next(err);
  }
}

async function directFlightFromAtoB(req, res, next) {
  try {
    res.json(await flights.directFlightFromAtoB(req.params.airportCode, req.params.destinationCode));
  } catch (err) {
    console.error(`Error while getting flights`, err.message);
    next(err);
  }
}
async function directFlightFrom(req, res, next) {
  try {
    res.json(await flights.directFlightFrom(req.params.airportCode));
  } catch (err) {
    console.error(`Error while getting flights`, err.message);
    next(err);
  }
}

async function directFlightTo(req, res, next) {
  try {
    res.json(await flights.directFlightTo(req.params.airportCode));
  } catch (err) {
    console.error(`Error while getting flights`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await flights.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating flights`, err.message);
    next(err);
  }
}


async function create(req, res, next) {
  try {
    res.json(await flights.create(req.body));
  } catch (err) {
    console.error(`Error while creating flights`, err.message);
    next(err);
  }
}




async function importCsvFlights(req, res, next) {
  try {
    await flights.uploadCsvFlights(req.file.path, (error, result) => {
      if (error) {
        console.error(`Error while importing CSV data:`, error);
        return res.status(500).json({ message: 'Failed to import CSV data' });
      }
      return res.status(200).json({ message: 'CSV data imported successfully' });
    });
  } catch (error) {
    console.error(`Error while importing CSV data:`, error);
    return res.status(500).json({ message: 'Failed to import CSV data' });
  }
}




module.exports = {
  get,
  directFlightFromAtoB,
  directFlightFrom,
  directFlightTo,
  update,
  create,
  importCsvFlights,
};
