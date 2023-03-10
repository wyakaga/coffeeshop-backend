const db = require('../configs/postgre');

const userVerification = (body) => {
  return new Promise((resolve, reject) => {
    //TODO use JOIN to get the profile image
    const sql = "SELECT id, password FROM users WHERE email = $1";
    const values = [body.email];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getPassword = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT u.password FROM users u WHERE id = $1";
    const values = [userId];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const editPassword = (userId, newPwd) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET password = $1 WHERE id = $2";
    const values = [userId, newPwd];
    db.query(sql, values, (err, result) => {
      if(err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = { userVerification, getPassword, editPassword };