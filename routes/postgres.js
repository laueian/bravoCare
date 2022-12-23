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

module.exports = {getJobs};
