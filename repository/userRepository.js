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
      if (rows.affectedRows === 1) {
        isRegisterSuccess = true;
      }
    } catch (error) {
      console.log(error);
    }

    return isRegisterSuccess;
  };

  setValidationTokenInDB = async (email, validationToken) => {
    try {
      const [rows, fields] = await this.pool.query(
        `UPDATE users SET validationToken = '${validationToken}' WHERE email = '${email}';`
      );
      console.log(rows);
      if (rows.changedRows !== 1) {
        throw new Error("Could not set validation token in DB");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  login = async (email, password, sessionToken) => {
    let isLoginSuccess = false;

    try {
      const [rows, fields] = await this.pool.query(
        `UPDATE users SET token = '${sessionToken}' WHERE email = '${email}' AND password = '${password}' AND user_id <> 0 ;`
      );

      console.log(rows);
      if (rows.changedRows === 1) {
        isLoginSuccess = true;
      }
    } catch (error) {
      console.log(error);
      isLoginSuccess = false;
    }

    return isLoginSuccess;
  };

  // setSessionTokenInDB = async (email, token, pool) => {
  //   try {
  //     const [rows, fields] = await pool.query(
  //       `UPDATE users SET token = '${token}' WHERE email = '${email}';`
  //     );
  //     console.log(rows);
  //     console.log("Updated token");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  tryVerifyEmail = async (validationToken) => {
    let isVerifyEmailSuccess = false;

    try {
      const [rows, fields] = await this.pool.query(
        `UPDATE users SET isValidated = true WHERE validationToken = '${validationToken}';`
      );
      if (rows.changedRows === 1) {
        isVerifyEmailSuccess = true;
      }
      console.log(rows);
    } catch (error) {
      console.log(error);
      isVerifyEmailSuccess = false;
    }

    return isVerifyEmailSuccess;
  };
}

exports.UserRepository = UserRepository;
