const express = require('express');
const app = express();

app.get('/foo', (req, res) => res.send('Hello world!'));

const postgres = require('./postgres');

app.use(express.json('type'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers',
  );
  next();
});

app.get('/getQuestionOneShifts', (req, res) => {
  postgres
    .getQuestionOneShifts()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.post('/getShiftOverlap', (req, res) => {
  postgres
    .getShiftOverlap(req.body)
    .then(response => {
      let result = {
        overlapMin: null,
        maxThreshold: null,
        exceedsThreshold: null,
      };

      const shiftA = 0;
      const shiftB = 1;

      // split the time into an array as such [hh, mm, ss]
      const endTimeSplit = response[shiftA].end_time.split(':');
      const startTimeSplit = response[shiftB].start_time.split(':');

      // convert the time into milliseconds
      const endMilli =
        Number(endTimeSplit[0] * 60 * 60 * 1000) +
        Number(endTimeSplit[1] * 60 * 1000) +
        Number(endTimeSplit[2] * 1000);

      const startMilli =
        Number(startTimeSplit[0] * 60 * 60 * 1000) +
        Number(startTimeSplit[1] * 60 * 1000) +
        Number(startTimeSplit[2] * 1000);

      // load result
      if (response[shiftA].facility_id === response[shiftB].facility_id) {
        result.maxThreshold = 0;
      } else {
        result.maxThreshold = 30;
      }

      result.overlapMin = (endMilli - startMilli) / (60 * 1000);

      if (result.overlapMin > result.maxThreshold) {
        result.exceedsThreshold = true;
      } else {
        result.exceedsThreshold = false;
      }

      res.status(200).send(result);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

module.exports = app;

if (module.hot) {
  module.hot.accept();
}
