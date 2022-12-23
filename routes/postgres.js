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
    'SELECT q.*, f.facility_name FROM question_one_shifts as q INNER JOIN facilities  as f ON q.facility_id = f.facility_id;';

  return new Promise(function (resolve, reject) {
    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results.rows);
    });
  });
};

module.exports = {getJobs, getQuestionOneShifts};
