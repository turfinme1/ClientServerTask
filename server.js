const http = require("http");
const path = require("path");
const { log } = require("console");
const fs = require("fs");
const url = require("url");
const fsPromises = require("fs").promises;
const querystring = require("querystring");
const sql = require("mysql2");
const config = require("./dbConfig");

const { login, register } = require("./userAuthentication");
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
  pool.query("SELECT * FROM Users", (error, results, fields) => {
    if (error) {
      log(error);
    }
    log(results);
  });

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
      await register(name, username, email, password, pool);
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
      await login(email, password, pool);
      serveFile(path.join(__dirname, "views", "index.html"), "text/html", res);
    } else {
      serveFile(path.join(__dirname, "views", "login.html"), "text/html", res);
    }
  } else if (fs.existsSync(filePath)) {
    serveFile(filePath, contentType, res);
  } else {
    log(path.parse(filePath));
    serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
  }
});

server.listen(PORT, () => log(`Server running on port ${PORT}`));

// await serverFile
