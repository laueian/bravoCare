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
  return new Promise(function (resolve, reject) {
    const query =
      'SELECT q.*, f.facility_name FROM question_one_shifts as q INNER JOIN facilities as f ON q.facility_id = f.facility_id;';

    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results.rows);
    });
  });
};

const getShiftOverlap = body => {
  return new Promise(function (resolve, reject) {
    const {shift_id_one, shift_id_two} = body;
    const query =
      'SELECT q.*, f.facility_name FROM question_one_shifts as q INNER JOIN facilities as f ON q.facility_id = f.facility_id AND q.shift_id IN ($1, $2)';

    pool.query(query, [shift_id_one, shift_id_two], (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results.rows);
    });
  });
};

const getQuery = body => {
  return new Promise(function (resolve, reject) {
    const {queryNumber} = body;

    let query = '';

    switch (queryNumber) {
      case 4:
        query =
          'SELECT J.FACILITY_ID, J.JOB_ID, COUNT(DISTINCT (J.JOB_ID,J.FACILITY_ID)) AS TOTAL_HIRED, J.TOTAL_NUMBER_NURSES_NEEDED, (J.TOTAL_NUMBER_NURSES_NEEDED - COUNT(DISTINCT (J.JOB_ID, J.FACILITY_ID))) AS REMAINING_SPOTS FROM JOBS AS J INNER JOIN NURSE_HIRED_JOBS AS NHJ ON J.JOB_ID = NHJ.JOB_ID INNER JOIN NURSES AS N ON N.NURSE_ID = NHJ.NURSE_ID WHERE J.NURSE_TYPE_NEEDED = N.NURSE_TYPE GROUP BY J.FACILITY_ID, J.JOB_ID ORDER BY J.FACILITY_ID, J.JOB_ID';
        break;
      case 5:
        break;
      case 6:
        break;

      default:
        break;
    }

    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results.rows);
    });
  });
};

module.exports = {
  getJobs,
  getQuestionOneShifts,
  getShiftOverlap,
  getQuery,
};
