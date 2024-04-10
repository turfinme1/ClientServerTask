const querystring = require("querystring");
const url = require("url");

const {
  serverSideLoginValidation,
  serverSideRegisterValidation,
} = require("../util/dataValidation");
const { createResponse } = require("../util/requestUtil");

const routes = ({ userService, reqToQuery }) => ({
  "/register:post": async (req, res) => {
    const query = await reqToQuery(req);
    const { name, username, email, password } = querystring.parse(query);

    if (
      serverSideRegisterValidation(name, username, email, password) === false
    ) {
      return createResponse(res, 401, "Invalid input. Please try again.");
    }

    try {
      await userService.register(name, username, email, password);
      return createResponse(res, 201, "User registered successfully.");
    } catch (error) {
      console.log(error);
      return createResponse(
        res,
        401,
        "Could not register user. Please try again."
      );
    }
  },

  "/login:post": async (req, res) => {
    const query = await reqToQuery(req);
    const { email, password } = querystring.parse(query);

    if (serverSideLoginValidation(email, password) === false) {
      return createResponse(res, 401, "Invalid input. Please try again.");
    }

    try {
      const sessionToken = await userService.login(email, password);

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      return res.end(JSON.stringify({ sessionToken: sessionToken }));
    } catch (error) {
      console.log(error);
      return createResponse(res, 401, "Invalid email or password.");
    }
  },

  "/confirm:get": async (req, res) => {
    const { query } = url.parse(req.url);
    const { validationToken } = querystring.parse(query);

    try {
      await userService.verifyEmail(validationToken);
      return createResponse(res, 200, "Email verified.");
    } catch (error) {
      console.log(error);
      return createResponse(
        res,
        401,
        "Could not verify email. Please try again."
      );
    }
  },
});

exports.routes = routes;
