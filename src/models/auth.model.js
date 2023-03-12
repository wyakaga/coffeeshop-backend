const db = require('../configs/postgre');

const userVerification = (body) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT u.id, u.password, u.role_id, p.img AS img
    FROM users u
    JOIN profiles p ON u.id = p.user_id
    WHERE email = $1`;
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
    const values = [newPwd, userId];
    db.query(sql, values, (err, result) => {
      if(err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = { userVerification, getPassword, editPassword };