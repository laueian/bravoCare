const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'dummyUser',
  host: 'localhost',
  database: 'bravoCareDB',
  password: 'password',
  port: 5432,
});

const getJobs = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM jobs', (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results.rows);
    });
  });
};

const getQuestionOneShifts = () => {
  const query =
    'SELECT q.*, f.facility_name FROM question_one_shifts as q INNER JOIN facilities as f ON q.facility_id = f.facility_id;';

  return new Promise(function (resolve, reject) {
    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results.rows);
    });
  });
};

const getShiftOverlap = () => {
  return new Promise(function (resolve, reject) {
    // let result = {
    //   overlapMin: null,
    //   maxThreshold: null,
    //   exceedsThreshold: null,
    // };

    getQuestionOneShifts()
      .then(response => {
        let result = {
          overlapMin: null,
          maxThreshold: null,
          exceedsThreshold: null,
        };

        // rows.push(response);
        const shiftA = 3;
        const shiftB = 0;

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

        resolve(result);
      })
      .catch(error => {
        reject(error);
      });

    // const shiftA = 5;
    // const shiftB = 0;

    // // split the time into an array as such [hh, mm, ss]
    // const endTimeSplit = rows[shiftA].end_time.split(':');
    // const startTimeSplit = rows[shiftB].start_time.split(':');

    // // convert the time into milliseconds
    // const endMilli =
    //   Number(endTimeSplit[0] * 60 * 60 * 1000) +
    //   Number(endTimeSplit[1] * 60 * 1000) +
    //   Number(endTimeSplit[2] * 1000);

    // const startMilli =
    //   Number(startTimeSplit[0] * 60 * 60 * 1000) +
    //   Number(startTimeSplit[1] * 60 * 1000) +
    //   Number(startTimeSplit[2] * 1000);

    // if (rows[shiftA].facility_id === rows[shiftB].facility_id) {
    //   result.maxThreshold = 0;
    // } else {
    //   result.maxThreshold = 30;
    // }

    // result.overlapMin = (endMilli - startMilli) / (60 * 1000);

    // if (result.overlapMin > result.maxThreshold) {
    //   result.exceedsThreshold = true;
    // } else {
    //   result.exceedsThreshold = false;
    // }

    // resolve(result);
  });
};

module.exports = {getJobs, getQuestionOneShifts, getShiftOverlap};
