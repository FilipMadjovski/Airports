const airports = require('../services/airports.service');

async function get(req, res, next) {
    try {
        res.json(await airports.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting airports`, err.message);
        next(err);
    }
}

async function getMostPassengers(req, res, next) {
    console.log(req.params.countryName, 'req.query.page')
    try {
        res.json(await airports.getMostPassengers(req.params.countryName));
    } catch (err) {
        console.error(`Error while getting airports`, err.message);
        next(err);
    }
}

async function create(req, res, next) {

    try {
        res.json(await airports.create(req.body));
    } catch (err) {
        console.error(`Error while creating airport`, err.message);
        next(err);
    }
}


async function remove(req, res, next) {
    try {
        res.json(await airports.remove(req.params.id));
    } catch (err) {
        console.error(`Error while deleting airport`, err.message);
        next(err);
    }
}

async function importCsvAirports(req, res, next) {
    try {
        await airports.uploadCsvAirports(req.file.path, (error, result) => {
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
    getMostPassengers,
    create,
    remove,
    importCsvAirports,
};
