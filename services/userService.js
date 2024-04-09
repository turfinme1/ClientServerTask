const { sendEmail } = require("./emailSenderService");
const { v4: uuidv4 } = require("uuid");

class UserService {
  constructor({ userRepository, emailSenderService }) {
    this.userRepository = userRepository;
    this.emailSenderService = emailSenderService;
  }

  register = async (name, username, email, password) => {
    await this.userRepository.register(name, username, email, password);
    
    const validationToken = this.#getToken();
    await this.userRepository.setValidationTokenInDB(email, validationToken);
    await this.emailSenderService.sendValidationEmail(email, validationToken);
  };

  login = async (email, password) => {
    const sessionToken = this.#getToken();
    
    const isLoginSuccess = await this.userRepository.login(
      email,
      password,
      sessionToken
    );

    return isLoginSuccess ? sessionToken : null;
  };

  verifyEmail = async (validationToken) => {
    await this.userRepository.tryVerifyEmail(validationToken);
  };

  #getToken = () => {
    return uuidv4();
  };
}

exports.UserService = UserService;

// const register = async (name, username, email, password, pool) => {
//   let isRegisterSuccess = false;
//   try {
//     const [rows, fields] = await pool.query(
//       `INSERT INTO users (user_id,name,username,email,password,isValidated) VALUES (null,'${name}' ,'${username}','${email}','${password}',false);`
//     );
//     console.log(rows);
//     isRegisterSuccess = true;
//   } catch (error) {
//     console.log(error);
//   }
//   return isRegisterSuccess;
// };

// const login = async (email, password, pool) => {
//   let isLoginSuccess = false;

//   try {
//     const [rows, fields] = await pool.query(
//       `SELECT * FROM users WHERE email = '${email}' AND password = '${password}';`
//     );
//     console.log(rows);
//     if (rows.length === 1) {
//       isLoginSuccess = true;
//     }
//   } catch (error) {
//     log(error);
//   }

//   return isLoginSuccess;
// };

// const tryVerifyEmail = async (validationToken, pool) => {
//   try {
//     const [rows, fields] = await pool.query(
//       `UPDATE users SET isValidated = true WHERE validationToken = '${validationToken}';`
//     );
//     console.log(rows);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getToken = () => {
//   return uuidv4();
// };

// const setValidationTokenInDB = async (email, validationToken, pool) => {
//   try {
//     const [rows, fields] = await pool.query(
//       `UPDATE users SET validationToken = '${validationToken}' WHERE email = '${email}';`
//     );
//     console.log(rows);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const setSessionTokenInDB = async (email, token, pool) => {
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

// const sendValidationEmail = async (emailReceiver, validationToken) => {
//   sendEmail(emailReceiver, validationToken);
// };

// exports.register = register;
// exports.login = login;
// exports.getToken = getToken;
// exports.tryVerifyEmail = tryVerifyEmail;
// exports.setValidationTokenInDB = setValidationTokenInDB;
// exports.setSessionTokenInDB = setSessionTokenInDB;