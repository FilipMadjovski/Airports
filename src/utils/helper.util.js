const db = require('../configs/db.config');
const csv = require('csv');
const fs = require('fs');
const schedule = require('node-schedule');

function uploadCsvFlights(filePath, callback) {
  let csvDataColl = [];
  fs.createReadStream(filePath)
    .pipe(csv.parse())
    .on('data', function (data) {
      csvDataColl.push(data);
    })
    .on('end', function () {
      csvDataColl.shift();
      const formattedData = csvDataColl.map(row => {
        const values = row[0].split(';');
        return [
          values[0].trim(),
          values[1].trim(),
          values[2].trim(),
          values[3].trim()
        ];
      });
      let values = formattedData.map(row => `('${row[0]}', '${row[1]}', '${row[2]}', '${row[3]}')`).join(", ");
      let query = `INSERT INTO flights (\`Code of Starting Airport\`, \`Code of Destination Airport\`, \`Departure time in minutes since 0:00h\`, \`Flight duration in minutes\`) VALUES ${values}`;
      db.query(query, (error, result) => {
        if (error) {
          callback(error);
        } else {
          callback(null, result);
        }
      });
    });
}


function uploadCsvAirport(filePath, callback) {
  let csvDataColl = [];

  fs.createReadStream(filePath)
    .pipe(csv.parse())
    .on('data', function (data) {
      csvDataColl.push(data);
    })
    .on('end', function () {
      csvDataColl.shift();

      const formattedData = csvDataColl.map(row => {
        const values = row[0].split(';');
        return [
          values[0].trim(),
          values[1].trim(),
          values[2].trim(),
          values[3].trim()
        ];
      });

      let values = formattedData.map(row => `('${row[0]}', '${row[1]}', '${row[2]}', '${row[3]}')`).join(", ");
      let query = `INSERT INTO airports (\`Airport name\`, \`Country name\`, \`Airport code\`, \`Number of passengers it transports annually\`) VALUES ${values}`;

      db.query(query, (error, result) => {
        if (error) {
          callback(error);
        } else {
          callback(null, result);
        }
      });
    });
}

function deleteFlightsWithLongDuration() {

  const query = `DELETE FROM flights WHERE \`Flight duration in minutes\` > 600`;

  db.query(query, (error, result) => {
    if (error) {
      console.error('Failed to delete flights:', error);
    } else {
      console.log('Flights deleted successfully.');
    }
  });
}




module.exports = {
  uploadCsvFlights,
  uploadCsvAirport,
  deleteFlightsWithLongDuration,
}
