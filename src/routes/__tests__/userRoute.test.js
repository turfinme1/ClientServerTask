const { errorMonitor } = require("form-data");
const { createResponse } = require("../../util/requestUtil.js");
const { routes } = require("../userRoute.js");

describe("userRoutes", () => {
  let userRoute;

  const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
    verifyEmail: jest.fn(),
  };
  let mockReqToQuery = jest.fn();
  beforeEach(() => {
    userRoute = routes({
      userService: mockUserService,
      reqToQuery: mockReqToQuery,
    });
    jest.clearAllMocks();
  });

  describe("/register:post", () => {
    test("should create 201 response if register is successful", async () => {
      //   mockReqToQuery.mockResolvedValue("email=abv%40abv.bg&password=12345678");
      mockReqToQuery = jest
        .fn()
        .mockResolvedValue(
          "name=John&username=johndoeasd&email=john@example.com&password=123456"
        );
      userRoute = routes({
        userService: mockUserService,
        reqToQuery: mockReqToQuery,
      });

      const req = {
        body: "name=John&username=johndoe&email=john@example.com&password=123456",
      };
      const res = {
        writeHead: jest
          .fn()
          .mockImplementation((status, headers) => expect(status).toBe(201)),
        end: jest.fn(),
      };

      await userRoute["/register:post"](req, res);
    });
    test("should return 401 response if register is not successful", async () => {
      const reqData =
        "name=&username=alex&email=alexander@abv.bg&password=alex1234";
      mockReqToQuery = jest.fn().mockResolvedValue(reqData);
      userRoute = routes({
        userService: mockUserService,
        reqToQuery: mockReqToQuery,
      });

      const req = {
        body: reqData,
      };
      const res = {
        writeHead: jest
          .fn()
          .mockImplementation((status, headers) => expect(status).toBe(401)),
        end: jest.fn(),
      };

      await userRoute["/register:post"](req, res);
    });
    test("should return 401 response if register throws an error", async () => {
      const reqData =
        "name=alexander&username=alex123456&email=alexander@abv.bg&password=alex1234";
      mockReqToQuery = jest.fn().mockResolvedValue(reqData);
      mockUserService.register.mockRejectedValue(
        new Error("Could not register user.")
      );
      userRoute = routes({
        userService: mockUserService,
        reqToQuery: mockReqToQuery,
      });

      const req = {
        body: reqData,
      };
      const res = {
        writeHead: jest
          .fn()
          .mockImplementation((status, headers) => expect(status).toBe(401)),
        end: jest.fn(),
      };

      await userRoute["/register:post"](req, res);
    });

    describe("/login:post", () => {
      test("should login a user successfully and return 200 response", async () => {
        const reqData = "email=alexander@abv.bg&password=alex1234";
        const expectedToken = "0c638888-8e37-4025-8613-76137b2b7ba9";
        mockReqToQuery = jest.fn().mockResolvedValue(reqData);
        mockUserService.login.mockResolvedValue(expectedToken);

        userRoute = routes({
          userService: mockUserService,
          reqToQuery: mockReqToQuery,
        });

        const req = {
          body: reqData,
        };
        const res = {
          writeHead: jest
            .fn()
            .mockImplementation((status, headers) => expect(status).toBe(200)),
          end: jest.fn(),
        };

        const result = await userRoute["/login:post"](req, res);
        const expected = createResponse(res, 200, {
          sessionToken: expectedToken,
        });

        expect(result).toEqual(expected);
      });
      test("should return 401 response if login fails", async () => {
        const reqData = "email=alexander@abv.bg&password=alex1234";
        mockReqToQuery = jest.fn().mockResolvedValue(reqData);
        mockUserService.login.mockRejectedValue(
          new Error("Invalid email or password.")
        );

        userRoute = routes({
          userService: mockUserService,
          reqToQuery: mockReqToQuery,
        });

        const req = {
          body: reqData,
        };
        const res = {
          writeHead: jest
            .fn()
            .mockImplementation((status, headers) => expect(status).toBe(401)),
          end: jest.fn(),
        };

        await userRoute["/login:post"](req, res);
      });
      test("should return 401 response if email or pasword are not valid", async () => {
        const reqData = "email=alexander@abv.bg&password=";
        mockReqToQuery = jest.fn().mockResolvedValue(reqData);

        userRoute = routes({
          userService: mockUserService,
          reqToQuery: mockReqToQuery,
        });

        const req = {
          body: reqData,
        };
        const res = {
          writeHead: jest
            .fn()
            .mockImplementation((status, headers) => expect(status).toBe(401)),
          end: jest.fn(),
        };

        await userRoute["/login:post"](req, res);
      });
      //
    });

    describe("/confirm:get", () => {
      test("should create 200 response when email is verified", async () => {
        const reqData =
          "/confirm?validationToken=0c638888-8e37-4025-8613-76137b2b7ba9";
        mockUserService.verifyEmail.mockResolvedValue(true);
        userRoute = routes({
          userService: mockUserService,
          reqToQuery: mockReqToQuery,
        });

        const req = { url: reqData };
        const res = {
          writeHead: jest
            .fn()
            .mockImplementation((status, headers) => expect(status).toBe(200)),
          end: jest.fn(),
        };

        await userRoute["/confirm:get"](req, res);
      });
      test("should return 401 response if email verification throws error", async () => {
        const reqData =
          "/confirm?validationToken=0c638888-8e37-4025-8613-76137b2b7ba9";
        mockUserService.verifyEmail.mockRejectedValue(
          new Error("Could not verify email.")
        );
        userRoute = routes({
          userService: mockUserService,
          reqToQuery: mockReqToQuery,
        });

        const req = { url: reqData };
        const res = {
          writeHead: jest
            .fn()
            .mockImplementation((status, headers) => expect(status).toBe(401)),
          end: jest.fn(),
        };

        await userRoute["/confirm:get"](req, res);
      });
    });
  });
});
