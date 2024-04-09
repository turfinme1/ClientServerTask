const sql = require("mysql2/promise");

class UserRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  register = async (name, username, email, password) => {
    let isRegisterSuccess = false;

    try {
      const [rows, fields] = await this.pool.query(
        `INSERT INTO users (user_id,name,username,email,password,isValidated) VALUES (null,'${name}' ,'${username}','${email}','${password}',false);`
      );
      console.log(rows);
      isRegisterSuccess = true;
    } catch (error) {
      console.log(error);
    }

    return isRegisterSuccess;
  };

  setValidationTokenInDB = async (email, validationToken, pool) => {
    try {
      const [rows, fields] = await pool.query(
        `UPDATE users SET validationToken = '${validationToken}' WHERE email = '${email}';`
      );
      console.log(rows);
    } catch (error) {
      console.log(error);
    }
  };

  login = async (email, password, pool) => {
    let isLoginSuccess = false;

    try {
      const [rows, fields] = await pool.query(
        `SELECT * FROM users WHERE email = '${email}' AND password = '${password}';`
      );
      console.log(rows);
      if (rows.length === 1) {
        isLoginSuccess = true;
      }
    } catch (error) {
      log(error);
    }

    return isLoginSuccess;
  };

  setSessionTokenInDB = async (email, token, pool) => {
    try {
      const [rows, fields] = await pool.query(
        `UPDATE users SET token = '${token}' WHERE email = '${email}';`
      );
      console.log(rows);
      console.log("Updated token");
    } catch (error) {
      console.log(error);
    }
  };

  tryVerifyEmail = async (validationToken, pool) => {
    try {
      const [rows, fields] = await pool.query(
        `UPDATE users SET isValidated = true WHERE validationToken = '${validationToken}';`
      );
      console.log(rows);
    } catch (error) {
      console.log(error);
    }
  };
}

exports.UserRepository = UserRepository;
