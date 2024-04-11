const { UserRepository } = require("../../repository/userRepository.js");

let userRepository;
const poolMock = {
  query: jest.fn(),
};
describe("userRepository", () => {
  beforeEach(() => {
    userRepository = new UserRepository({ pool: poolMock });
    jest.resetAllMocks();
  });

  describe("register", () => {
    test("should register a user and return true", async () => {
      const rows = { affectedRows: 1 };
      userRepository.pool.query = jest.fn().mockResolvedValue([rows]);

      const name = "Alexander";
      const username = "alexander1234";
      const email = "alexander@abv.bg";
      const password = "alex123456";

      const result = await userRepository.register(
        name,
        username,
        email,
        password
      );

      expect(result).toBe(true);
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `INSERT INTO users (user_id,name,username,email,password,isValidated) VALUES (null,'${name}' ,'${username}','${email}','${password}',false);`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
    test("should return false if there is an error when querying database", async () => {
      userRepository.pool.query = jest
        .fn()
        .mockRejectedValue(new Error("Registration failed"));

      const name = "Alexander";
      const username = "alexander1234";
      const email = "alexander@abv.bg";
      const password = "alex123456";

      const result = await userRepository.register(
        name,
        username,
        email,
        password
      );

      expect(result).toBe(false);
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `INSERT INTO users (user_id,name,username,email,password,isValidated) VALUES (null,'${name}' ,'${username}','${email}','${password}',false);`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
    test("should return false if there are no affected rows in database", async () => {
      const rows = { affectedRows: 0 };
      userRepository.pool.query = jest.fn().mockResolvedValue([rows]);

      const name = "Alexander";
      const username = "alexander1234";
      const email = "alexander@abv.bg";
      const password = "alex123456";

      const result = await userRepository.register(
        name,
        username,
        email,
        password
      );

      expect(result).toBe(false);
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `INSERT INTO users (user_id,name,username,email,password,isValidated) VALUES (null,'${name}' ,'${username}','${email}','${password}',false);`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("setValidationTokenInDB", () => {
    test("should set the validation token in the database and return true", async () => {
      const rows = { changedRows: 1 };
      userRepository.pool.query = jest.fn().mockResolvedValue([rows]);

      const email = "alexander@abv.bg";
      const validationToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      const result = await userRepository.setValidationTokenInDB(
        email,
        validationToken
      );

      expect(result).toBe(true);
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `UPDATE users SET validationToken = '${validationToken}' WHERE email = '${email}';`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
    test("should throw an error if setting the validation token in database fails", async () => {
      userRepository.pool.query = jest
        .fn()
        .mockRejectedValue(new Error("Could not set validation token in DB"));

      const email = "alexander@abv.bg";
      const validationToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      await expect(
        userRepository.setValidationTokenInDB(email, validationToken)
      ).rejects.toThrow("Could not set validation token in DB");
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `UPDATE users SET validationToken = '${validationToken}' WHERE email = '${email}';`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
    test("should thow and error if changedRows after querying is not 1", async () => {
      const rows = { changedRows: 0 };
      userRepository.pool.query = jest.fn().mockResolvedValue([rows]);

      const email = "alexander@abv.bg";
      const validationToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      await expect(
        userRepository.setValidationTokenInDB(email, validationToken)
      ).rejects.toThrow("Could not set validation token in DB");
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `UPDATE users SET validationToken = '${validationToken}' WHERE email = '${email}';`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("login", () => {
    test("should update the user's token in the database and return true", async () => {
      const rows = { changedRows: 1 };
      userRepository.pool.query = jest.fn().mockResolvedValue([rows]);

      const email = "alexander@abv.bg";
      const password = "alex123456";
      const sessionToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      const result = await userRepository.login(email, password, sessionToken);

      expect(result).toBe(true);
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `UPDATE users SET token = '${sessionToken}' WHERE email = '${email}' AND password = '${password}' AND user_id <> 0 ;`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
    test("should return false if login fails", async () => {
      const rows = { changedRows: 0 };
      userRepository.pool.query = jest.fn().mockResolvedValue([rows]);

      const email = "alexander@abv.bg";
      const password = "alex123456";
      const sessionToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      const result = await userRepository.login(email, password, sessionToken);

      expect(result).toBe(false);
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `UPDATE users SET token = '${sessionToken}' WHERE email = '${email}' AND password = '${password}' AND user_id <> 0 ;`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
    test("should return false if there is an error when querying database", async () => {
      userRepository.pool.query = jest
        .fn()
        .mockRejectedValue(new Error("Login failed"));

      const email = "alexander@abv.bg";
      const password = "alex123456";
      const sessionToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      const result = await userRepository.login(email, password, sessionToken);

      expect(result).toBe(false);
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `UPDATE users SET token = '${sessionToken}' WHERE email = '${email}' AND password = '${password}' AND user_id <> 0 ;`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
    //
  });

  describe("tryVerifyEmail", () => {
    test("should update the user's isValid field and return true", async () => {
      const rows = { affectedRows: 1 };
      userRepository.pool.query = jest.fn().mockResolvedValue([rows]);

      const validationToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      const result = await userRepository.tryVerifyEmail(validationToken);

      expect(result).toBe(true);
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `UPDATE users SET isValidated = true WHERE validationToken = '${validationToken}';`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
    test("should return false if there is an error when querying database", async () => {
      userRepository.pool.query = jest
        .fn()
        .mockRejectedValue(new Error("Verification failed"));

      const validationToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      const result = await userRepository.tryVerifyEmail(validationToken);

      expect(result).toBe(false);
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `UPDATE users SET isValidated = true WHERE validationToken = '${validationToken}';`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
    test("should return false if there are no affected rows in database", async () => {
      const rows = { affectedRows: 0 };
      userRepository.pool.query = jest.fn().mockResolvedValue([rows]);

      const validationToken = "0c638888-8e37-4025-8613-76137b2b7ba9";

      const result = await userRepository.tryVerifyEmail(validationToken);

      expect(result).toBe(false);
      expect(userRepository.pool.query).toHaveBeenCalledWith(
        `UPDATE users SET isValidated = true WHERE validationToken = '${validationToken}';`
      );
      expect(userRepository.pool.query).toHaveBeenCalledTimes(1);
    });
  });
});
