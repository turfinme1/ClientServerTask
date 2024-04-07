const fs = require("fs");
const url = require("url");
const http = require("http");
const fsPromises = require("fs").promises;
const querystring = require("querystring");
const { log } = require("console");
const path = require("path");
const sql = require("mysql2/promise");

const config = require("./dbConfig");
const { sendEmail } = require("./emailSenderService");
const {
  login,
  register,
  tryVerifyEmail,
  getToken,
  setValidationTokenInDB,
  setSessionTokenInDB,
} = require("./userAuthentication");
const {
  serverSideLoginValidation,
  serverSideRegisterValidation,
} = require("./dataValidation");

const PORT = process.env.PORT || 3000;

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(filePath, "utf8");
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (error) {
    log(error);
    response.statusCode = 500;
    response.end();
  }
};

const reqToQuery = async (req) => {
  const buffer = [];
  for await (const chunk of req) {
    buffer.push(chunk);
  }
  return Buffer.concat(buffer).toString();
};

const server = http.createServer(async (req, res) => {
  log(req.url, req.method);

  const pool = sql.createPool(config);

  const extension = path.extname(req.url);
  const { pathname } = url.parse(req.url);
  log(extension);

  let contentType;
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    default:
      contentType = "text/html";
  }

  let filePath;
  if (contentType === "text/html" && req.url === "/") {
    filePath = path.join(__dirname, "views", "index.html");
  } else if (contentType === "text/html") {
    filePath = path.join(__dirname, "views", req.url);
  } else {
    filePath = path.join(__dirname, req.url);
  }

  if (!extension && req.url.slice(-1) !== "/") {
    filePath += ".html";
  }

  if (pathname === "/register" && req.method === "POST") {
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
    log(name, username, email, password);
  } else if (pathname === "/login" && req.method === "POST") {
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
  } else if (pathname.includes("/confirm")) {
    const { query } = url.parse(req.url);
    const { validationToken } = querystring.parse(query);

    await tryVerifyEmail(validationToken, pool);

    await serveFile(
      path.join(__dirname, "views", "index.html"),
      "text/html",
      res
    );
  } else if (fs.existsSync(filePath)) {
    await serveFile(filePath, contentType, res);
  } else {
    log(path.parse(filePath));
    await serveFile(
      path.join(__dirname, "views", "404.html"),
      "text/html",
      res
    );
  }
});

server.listen(PORT, () => log(`Server running on port ${PORT}`));

const registerHandler = async (name, username, email, password, pool) => {
  await register(name, username, email, password, pool);
  const validationToken = getToken();
  await setValidationTokenInDB(email, validationToken, pool);
  await sendEmail(email, validationToken);
};

const loginHandler = async (email, password, sessionToken, pool) => {
  const isLoginSuccess = await login(email, password, pool);

  if (isLoginSuccess) {
    await setSessionTokenInDB(email, sessionToken, pool);
  }

  return isLoginSuccess;
};
