const db = require('./db.service');
const csvUtils = require('../utils/helper.util');

async function uploadCsvFlights(filePath, res) {
    try {
        const message = await csvUtils.uploadCsvFlights(filePath, res);
        return { message };
    } catch (error) {
        console.error(`Error while importing CSV data:`, error);
        throw new Error('Failed to import CSV data');
    }
}

async function getMultiple() {
    const rows = await db.query(
        `SELECT * from flights`,
    );
    return {
        rows,
    }
}

async function create(flights) {
    if (!flights.codeStarting || !flights.codeDestination || !flights.timeStart || !flights.flightDuration) {
        return res.status(400).json({ error: "Incomplete data" });
    }

    const result = await db.query(
        `INSERT INTO flights (\`Code of Starting Airport\`, \`Code of Destination Airport\`, \`Departure time in minutes since 0:00h\`, \`Flight duration in minutes\`) VALUES (?, ?, ?, ?)`,
        [flights.codeStarting, flights.codeDestination, flights.timeStart, flights.flightDuration]
    );


    let message = 'Failed to add the flight';

    if (result.affectedRows) {
        message = 'Flight added successfully'
    }
    return { message };
}

async function update(id, flights) {
    const result = await db.query(
        `UPDATE flights SET 
                \`Code of Starting Airport\` = ?,
                \`Code of Destination Airport\` = ?,
                \`Departure time in minutes since 0:00h\` = ?,
                \`Flight duration in minutes\` = ?  
              WHERE id = ?`,
        [flights.codeStarting, flights.codeDestination, flights.timeStart, flights.flightDuration, id]
    );

    let message = 'Error in updating flight';

    if (result.affectedRows) {
        message = 'Flight updated successfully';
    }

    return { message };
}

async function directFlightFromAtoB(airportCode, destinationCode) {
    const result = await db.query(
        `SELECT a.\`Airport name\`, f.*
              FROM airports AS a
              JOIN flights AS f ON a.\`Airport code\` = f.\`Code of Starting Airport\`
              WHERE a.\`Airport code\` = ? AND f.\`Code of Destination Airport\` = ?`, [airportCode, destinationCode]
    );

    let message = 'Failed to retrieve flights';
    if (result) {
        message = result
    }
    return { message };
}

async function directFlightFrom(airportCode) {
    const result = await db.query(
        `SELECT a.\`Airport name\`, f.*
              FROM airports AS a
              JOIN flights AS f ON a.\`Airport code\` = f.\`Code of Starting Airport\`
              WHERE a.\`Airport code\` = ?
              ORDER BY f.\`Code of Destination Airport\`, f.\`Departure time in minutes since 0:00h\``, [airportCode]
    );

    let message = 'Failed to get direct flight';
    if (result) {
        message = result
    }

    return { message };
}

async function directFlightTo(airportCode) {
    const result = await db.query(
        `SELECT a.\`Airport name\`, f.*
              FROM airports AS a
              JOIN flights AS f ON a.\`Airport code\` = f.\`Code of Destination Airport\`
              WHERE f.\`Code of Destination Airport\` = ?`, [airportCode]
    );

    let message = 'Failed to get direct flight';
    if (result) {
        message = result
    }

    return { message };
}

module.exports = {
    getMultiple,
    directFlightFromAtoB,
    directFlightFrom,
    directFlightTo,
    update,
    create,
    uploadCsvFlights,
}
