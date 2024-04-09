const querystring = require("querystring");

const routes = ({ userService, serveFile, reqToQuery }) => ({
  "/register:post": async (req, res) => {
    const query = await reqToQuery(req);
    const { name, username, email, password } = querystring.parse(query);

    if (serverSideRegisterValidation(name, username, email, password)) {
      await registerHandler(name, username, email, password, pool);
      serveFile(path.join(__dirname, "views", "index.html"), "text/html", res);
    } else {
      serveFile(
        path.join(__dirname, "views", "register.html"),
        "text/html",
        res
      );
    }
  },

  "/login:post": async (req, res) => {
    const query = await reqToQuery(req);
    const { email, password } = querystring.parse(query);

    if (serverSideLoginValidation(email, password)) {
      const sessionToken = getToken();

      const isLoginSuccess = await loginHandler(
        email,
        password,
        sessionToken,
        pool
      );

      if (isLoginSuccess) {
        res.writeHead(200, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify({ sessionToken: sessionToken }));
      } else {
        res.writeHead(401, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Invalid email or password",
          })
        );
      }
    } else {
      serveFile(path.join(__dirname, "views", "login.html"), "text/html", res);
    }
  },

  "/confirm:get": async (req, res) => {
    const { query } = url.parse(req.url);
    const { validationToken } = querystring.parse(query);

    await tryVerifyEmail(validationToken, pool);

    await serveFile(
      path.join(__dirname, "views", "index.html"),
      "text/html",
      res
    );
  },
});
