const { v4: uuidv4 } = require("uuid");

class UserService {
  constructor({ userRepository, sendEmail }) {
    this.userRepository = userRepository;
    this.sendEmail = sendEmail;
  }

  register = async (name, username, email, password) => {
    const validationToken = this.#getToken();

    try {
      //unit of work
      if (await this.userRepository.register(name, username, email, password)) {
        await this.userRepository.setValidationTokenInDB(
          email,
          validationToken
        );
        await this.sendEmail(email, validationToken);
      }
    } catch (error) {
      console.log(error);
      throw new Error("Could not register user.");
    }
  };

  login = async (email, password) => {
    const sessionToken = this.#getToken();

    try {
      const isLoginSuccess = await this.userRepository.login(
        email,
        password,
        sessionToken
      );

      if (isLoginSuccess === false) {
        throw new Error("Invalid email or password.");
      }

      return sessionToken;
    } catch (error) {
      console.log(error);
      throw new Error("Could not login user.");
    }
  };

  verifyEmail = async (validationToken) => {
    try {
      if (
        (await this.userRepository.tryVerifyEmail(validationToken)) === false
      ) {
        throw new Error("Could not verify email.");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  #getToken = () => {
    return uuidv4();
  };
}

exports.UserService = UserService;
