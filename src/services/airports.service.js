const db = require('./db.service');
const csvUtils = require('../utils/helper.util');

async function getMultiple() {
    const rows = await db.query(
        `SELECT * from airports`,
    );

    return {
        rows,
    }
}


async function getMostPassengers(countryName) {
    const result = await db.query(
        `SELECT a.\`Airport name\`, a.\`Number of passengers it transports annually\`
        FROM airports AS a
        WHERE a.\`Country name\` = ?
        ORDER BY a.\`Number of passengers it transports annually\` DESC
        LIMIT 1`, [countryName]
    );

    let message = 'Failed to get most passengers';
    if (result) {
        message = result
    }
    return { message };
}

async function create(airport) {
    if (!airport.name || !airport.country || !airport.code || !airport.numb) {
        throw Error('Incomplete data');
    }

    const result = await db.query(
        `INSERT INTO airports (\`Airport name\`, \`Country name\`, \`Airport code\`, \`Number of passengers it transports annually\`) VALUES (?, ?, ?, ?)`,
        [airport.name, airport.country, airport.code, airport.numb]
    );


    let message = 'Failed to add the airport';

    if (result.affectedRows) {
        message = 'Airport added successfully'
    }
    return { message };
}

async function uploadCsvAirports(filePath, res) {
    try {
        const message = await csvUtils.uploadCsvAirport(filePath, res);
        return { message };
    } catch (error) {
        console.error(`Error while importing CSV data:`, error);
        throw new Error('Failed to import CSV data');
    }
}



async function remove(id) {
    const result = await db.query(
        `DELETE FROM airports WHERE id=?`,
        [id]
    );

    let message = 'Error in deleting airport';

    if (result.affectedRows) {
        message = 'Airport deleted successfully';
    }

    return { message };
}

module.exports = {
    getMultiple,
    getMostPassengers,
    create,
    remove,
    uploadCsvAirports,
}
