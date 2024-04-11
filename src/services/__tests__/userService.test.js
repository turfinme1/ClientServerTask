const { UserService } = require("../userService");

describe("UserService", () => {
  let userService;

  const userRepository = {
    register: jest.fn(),
    setValidationTokenInDB: jest.fn(),
    login: jest.fn(),
    tryVerifyEmail: jest.fn(),
  };
  const sendEmail = jest.fn();

  beforeEach(() => {
    userService = new UserService({ userRepository, sendEmail });
    jest.clearAllMocks();
  });

  describe("register", () => {
    test("should call repository functions and sendEmail with correct data when register is successful", async () => {
      userService.userRepository.register.mockResolvedValue(true);

      const name = "Alexander";
      const username = "alexander1234";
      const email = "alexander@abv.bg";
      const password = "alex123456";

      await userService.register(name, username, email, password);

      expect(userService.userRepository.register).toHaveBeenCalledWith(
        name,
        username,
        email,
        password
      );
      expect(
        userService.userRepository.setValidationTokenInDB
      ).toHaveBeenCalledWith(email, expect.any(String));
      expect(userService.sendEmail).toHaveBeenCalledWith(
        email,
        expect.any(String)
      );
    });

    test("should not call setValidationToken and sendEmail when register fails", async () => {
      userService.userRepository.register.mockResolvedValue(false);

      const name = "Alexander";
      const username = "alexander1234";
      const email = "alexander@abv.bg";
      const password = "alex123456";

      await userService.register(name, username, email, password);

      expect(userService.userRepository.register).toHaveBeenCalledWith(
        name,
        username,
        email,
        password
      );
      expect(
        userService.userRepository.setValidationTokenInDB
      ).toHaveBeenCalledTimes(0);
      expect(userService.sendEmail).toHaveBeenCalledTimes(0);
    });

    test("should throw an error when repository throws an error", async () => {
      userService.userRepository.register.mockRejectedValue(
        new Error("Could not register user.")
      );

      const name = "Alexander";
      const username = "alexander1234";
      const email = "alexander@abv.bg";
      const password = "alex123456";

      await expect(
        userService.register(name, username, email, password)
      ).rejects.toThrow("Could not register user.");
      expect(
        userService.userRepository.setValidationTokenInDB
      ).toHaveBeenCalledTimes(0);
      expect(userService.sendEmail).toHaveBeenCalledTimes(0);
    });
  });

  describe("login", () => {
    test("should call repository function with correct data", async () => {
      userService.userRepository.login.mockResolvedValue(true);

      const email = "alexander@abv.bg";
      const password = "alex123456";

      await userService.login(email, password);

      expect(userService.userRepository.login).toHaveBeenCalledWith(
        email,
        password,
        expect.any(String)
      );
      expect(userService.userRepository.login).toHaveBeenCalledTimes(1);
    });
    test("should return a session token when login is successful", async () => {
      userService.userRepository.login.mockResolvedValue(true);

      const email = "alexander@abv.bg";
      const password = "alex123456";

      const result = await userService.login(email, password);

      expect(result).toBeTruthy();
    });
    test("should throw an error when login fails", async () => {
      userService.userRepository.login.mockResolvedValue(false);

      const email = "alexander@abv.bg";
      const password = "alex123456";

      await expect(userService.login(email, password)).rejects.toThrow(
        "Could not login user."
      );
    });
    test("should throw an error when repository throws an error", async () => {
      userService.userRepository.login.mockRejectedValue(
        new Error("Could not login user.")
      );

      const email = "alexander@abv.bg";
      const password = "alex123456";

      await expect(userService.login(email, password)).rejects.toThrow(
        "Could not login user."
      );
    });
  });

  describe("verifyEmail", () => {
    test("should call repository function with correct data", async () => {
      const validationToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      await userService.verifyEmail(validationToken);

      expect(userService.userRepository.tryVerifyEmail).toHaveBeenCalledWith(
        validationToken
      );
    });

    test("should return true when email is verified", async () => {
      userService.userRepository.tryVerifyEmail.mockResolvedValue(true);

      const validationToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      const result = await userService.verifyEmail(validationToken);

      expect(result).toBe(true);
    });

    test("should throw an error when email verification fails", async () => {
      userService.userRepository.tryVerifyEmail.mockResolvedValue(false);

      const validationToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      await expect(userService.verifyEmail(validationToken)).rejects.toThrow(
        "Could not verify email."
      );
    });
    
    test("should throw an error when repository throws an error", async () => {
      userService.userRepository.tryVerifyEmail.mockRejectedValue(
        new Error("Could not verify email.")
      );

      const validationToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      await expect(userService.verifyEmail(validationToken)).rejects.toThrow(
        "Could not verify email."
      );
    });
  });
});
