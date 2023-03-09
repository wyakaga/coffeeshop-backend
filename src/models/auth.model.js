const db = require('../configs/postgre');

const userVerification = (body) => {
  return new Promise((resolve, reject) => {
    //TODO use JOIN to get the profile image
    const sql = "SELECT id, email FROM users WHERE email = $1 AND password = $2";
    const values = [body.email, body.password];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = { userVerification };