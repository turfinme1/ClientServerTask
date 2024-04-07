const { sendEmail } = require("./emailSenderService");
const { v4: uuidv4 } = require("uuid");

const register = async (name, username, email, password, pool) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
      return;
    }

    connection.query(
      `INSERT INTO users (user_id,name,username,email,password,isValidated) VALUES (null,'${name}' ,'${username}','${email}','${password}',false);`,
      (err, results, fields) => {
        connection.release();

        if (err) {
          console.log(err);
        }
      }
    );
  });
};

const login = async (email, password, pool) => {
  let token = getToken();

  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
      throw error;
    }

    connection.query(
      `SELECT * FROM users WHERE email = '${email}' AND password = '${password}';`,
      async (err, results, fields) => {
        connection.release();
        if (err) {
          console.log(err);
          token = null;
        } else if (results.length === 1) {
          await setSessionTokenInDB(email, token, pool);
        } else {
          token = null;
        }
        console.log(results);
      }
    );
  });

  return token;
};

const tryVerifyEmail = async (validationToken, pool) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
      return;
    }

    connection.query(
      `UPDATE users SET isValidated = true WHERE validationToken = '${validationToken}';`,
      (err, results, fields) => {
        connection.release();

        if (err) {
          console.log(err);
        }
      }
    );
  });
};

const getToken = () => {
  return uuidv4();
};

const setValidationTokenInDB = async (email, validationToken, pool) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
      return;
    }

    connection.query(
      `UPDATE users SET validationToken = '${validationToken}' WHERE email = '${email}';`,
      (err, results, fields) => {
        connection.release();

        if (err) {
          console.log(err);
        }
      }
    );
  });
};

const setSessionTokenInDB = async (email, token, pool) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
      return;
    }

    connection.query(
      `UPDATE users SET token = '${token}' WHERE email = '${email}';`,
      (err, results, fields) => {
        connection.release();

        if (err) {
          console.log(err);
        }
      }
    );
  });
};

const sendValidationEmail = async (email, validationToken) => {
  sendEmail(email, validationToken);
};

exports.register = register;
exports.login = login;
exports.getToken = getToken;
exports.tryVerifyEmail = tryVerifyEmail;
exports.setValidationTokenInDB = setValidationTokenInDB;
