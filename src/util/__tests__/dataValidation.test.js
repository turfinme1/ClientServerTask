const {
  serverSideRegisterValidation,
  serverSideLoginValidation,
  isValidEmail,
} = require("../dataValidation");

describe("dataValidation", () => {
  describe("serverSideRegisterValidation", () => {
    test("should return true if the data is valid", () => {
      const name = "Alex Prik";
      const email = "validmail@gmail.com";
      const username = "username20";
      const password = "password123";

      const result = serverSideRegisterValidation(
        name,
        username,
        email,
        password
      );

      expect(result).toBe(true);
    });
    test("should return false if name is empty string", () => {
      const name = "";
      const email = "validmail@gmail.com";
      const username = "username20";
      const password = "password123";

      const result = serverSideRegisterValidation(
        name,
        username,
        email,
        password
      );

      expect(result).toBe(false);
    });
    test("should return false if username is less than 8 characters", () => {
      const name = "Alex Prik";
      const email = "validmail@gmail.com";
      const username = "user567";
      const password = "password123";

      const result = serverSideRegisterValidation(
        name,
        username,
        email,
        password
      );

      expect(result).toBe(false);
    });
    test("should return false if email is empty string", () => {
      const name = "Alex Prik";
      const email = "";
      const username = "user567";
      const password = "password123";

      const result = serverSideRegisterValidation(
        name,
        username,
        email,
        password
      );

      expect(result).toBe(false);
    });
    test("should return false if email is not valid", () => {
      const name = "Alex Prik";
      const email = "abv@abg.bg@";
      const username = "user567";
      const password = "password123";

      const result = serverSideRegisterValidation(
        name,
        username,
        email,
        password
      );

      expect(result).toBe(false);
    });
  });

  describe("serverSideLoginValidation", () => {
    test("should return true if the username and password are valid", () => {
      const email = "validmail@abv.bg";
      const password = "password123";

      const result = serverSideLoginValidation(email, password);

      expect(result).toBe(true);
    });
    test("should return false if password is empty string", () => {
      const email = "validmail@gmail.com";
      const password = "";

      const result = serverSideLoginValidation(email, password);

      expect(result).toBe(false);
    });
    test("should return false if email is empty string", () => {
      const email = "";
      const password = "password123";

      const result = serverSideLoginValidation(email, password);

      expect(result).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    test("should return true if email is valid", () => {
      const email = "alex.m@abv.bg";

      const result = isValidEmail(email);

      expect(result).toBe(true);
    });
    test("should return false if email is invalid", () => {
      const email1 = "email@abv.bg.";
      const email2 = "email@abv@bg";
      const email3 = "email@abv";
      const email4 = "-email@abv.bg";

      const result1 = isValidEmail(email1);
      const result2 = isValidEmail(email2);
      const result3 = isValidEmail(email3);
      const result4 = isValidEmail(email4);

      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
      expect(result4).toBe(false);
    });
  });
});
