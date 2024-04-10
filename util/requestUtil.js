const fsPromises = require("fs").promises;
const { log } = require("console");
const path = require("path");

const reqToQuery = async (req) => {
  const buffer = [];
  for await (const chunk of req) {
    buffer.push(chunk);
  }
  return Buffer.concat(buffer).toString();
};

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

const getFilePath = (contentType, reqUrl, extension) => {
  let filePath;

  if (contentType === "text/html" && reqUrl === "/") {
    filePath = path.join(__dirname, "..", "views", "index.html");
  } else if (contentType === "text/html") {
    filePath = path.join(__dirname, "..", "views", reqUrl);
  } else {
    filePath = path.join(__dirname, "..", reqUrl);
  }

  if (!extension && reqUrl.slice(-1) !== "/") {
    filePath += ".html";
  }

  return filePath;
};

const getContentType = (extension) => {
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

  return contentType;
};

const createResponse = (res, statusCode, message) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  return res.end(
    JSON.stringify({
      message,
    })
  );
};

exports.reqToQuery = reqToQuery;
exports.serveFile = serveFile;
exports.getFilePath = getFilePath;
exports.getContentType = getContentType;
exports.createResponse = createResponse;
