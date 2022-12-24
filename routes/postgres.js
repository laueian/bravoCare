const Pool = require('pg').Pool;
// All params should be a .env file that isn't checked intot the repo
const pool = new Pool({
  user: 'dummyUser',
  host: 'localhost',
  database: 'bravoCareDB',
  password: 'password',
  port: 5432,
});

// This should implement pagination
// At scale this is very dangerous query
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
    // NBD - might want to style string to only be minum 100 char person line as to make query more readable
    const query =
      'SELECT q.*, f.facility_name \
       FROM question_one_shifts as q \
       INNER JOIN facilities as f ON q.facility_id = f.facility_id;';

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
    const { shift_id_one, shift_id_two } = body;
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
    const { queryNumber } = body;

    let query = '';

    switch (queryNumber) {
      case 4:
        query =
          'SELECT J.FACILITY_ID, J.JOB_ID, J.NURSE_TYPE_NEEDED, COUNT((J.FACILITY_ID, J.JOB_ID)) AS TOTAL_HIRED, J.TOTAL_NUMBER_NURSES_NEEDED, (J.TOTAL_NUMBER_NURSES_NEEDED - COUNT((J.JOB_ID,J.FACILITY_ID))) AS REMAINING_SPOTS FROM JOBS AS J LEFT JOIN NURSE_HIRED_JOBS AS NHJ ON J.JOB_ID = NHJ.JOB_ID INNER JOIN NURSES AS N ON N.NURSE_ID = NHJ.NURSE_ID WHERE J.NURSE_TYPE_NEEDED = N.NURSE_TYPE GROUP BY J.FACILITY_ID, J.JOB_ID ORDER BY J.FACILITY_ID, J.JOB_ID';
        break;
      case 5:
        query =
          'SELECT N2.NURSE_ID, N2.NURSE_NAME, N2.NURSE_TYPE, COUNT(N2.NURSE_ID) AS TOTAL_JOBS FROM NURSES AS N2 LEFT JOIN JOBS AS J2  ON N2.NURSE_TYPE = J2.NURSE_TYPE_NEEDED  AND J2.JOB_ID IN (SELECT T1.JOB_ID AS T1_JOB_ID FROM (SELECT J.JOB_ID, J.NURSE_TYPE_NEEDED, (J.TOTAL_NUMBER_NURSES_NEEDED - COUNT((J.JOB_ID,J.FACILITY_ID))) AS REMAINING_SPOTS FROM JOBS AS J LEFT JOIN NURSE_HIRED_JOBS AS NHJ ON J.JOB_ID = NHJ.JOB_ID INNER JOIN NURSES AS N ON N.NURSE_ID = NHJ.NURSE_ID WHERE J.NURSE_TYPE_NEEDED = N.NURSE_TYPE GROUP BY J.FACILITY_ID, J.JOB_ID ORDER BY J.JOB_ID) AS T1 WHERE T1.REMAINING_SPOTS != 0)  AND J2.JOB_ID NOT IN  (SELECT NHJ1.JOB_ID AS NHJ1_JOB_ID FROM NURSES AS N1 LEFT JOIN NURSE_HIRED_JOBS AS NHJ1 ON N1.NURSE_ID = NHJ1.NURSE_ID WHERE N1.NURSE_ID = N2.NURSE_ID ORDER BY N1.NURSE_ID) GROUP BY N2.NURSE_ID ORDER BY N2.NURSE_ID';
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
