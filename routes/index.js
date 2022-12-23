const express = require('express');
const router = express();

router.get('/foo', (req, res) => res.send('Hello world!'));

const postgres = require('./postgres');

router.use(express.json());
router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers',
  );
  next();
});

router.get('/getQuestionOneShifts', (req, res) => {
  postgres
    .getQuestionOneShifts()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

router.get('/getShiftOverlap', (req, res) => {
  postgres
    .getShiftOverlap()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

module.exports = router;

if (module.hot) {
  module.hot.accept();
}
