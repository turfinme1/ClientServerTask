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
  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
      return;
    }

    connection.query(
      `SELECT * FROM users WHERE email = '${email}' AND password = '${password}';`,
      (err, results, fields) => {
        connection.release();

        if (err) {
          console.log(err);
        }

        console.log(results);
      }
    );
  });
};

exports.register = register;
exports.login = login;
