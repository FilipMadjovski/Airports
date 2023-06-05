require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const app = express();
const port = process.env.PORT || 3000;
const airportRoute = require('./src/routes/airport.route');
const flightRoute = require('./src/routes/flight.route');
const { deleteFlightsWithLongDuration } = "./src/utils/helper.util.js"


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/src/views/index.html");
})

app.use('/airport', airportRoute);
app.use('/flight', flightRoute);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 'message': err.message });
  return;
});


const deleteFlightsJob = setInterval(() => {
  const date = new Date();
  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();

  if (currentHour === 1 && currentMinute === 0) {
    deleteFlightsWithLongDuration();
  }
}, 60000);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
