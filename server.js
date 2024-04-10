const fs = require("fs");
const url = require("url");
const http = require("http");
const { log } = require("console");
const path = require("path");
const sql = require("mysql2/promise");

const config = require("./dbConfig");
const { sendEmail } = require("./src/services/emailSenderService");
const { UserRepository } = require("./src/repository/userRepository.js");
const { UserService } = require("./src/services/userService.js");
const { routes } = require("./src/routes/userRoute.js");
const {
  reqToQuery,
  serveFile,
  getFilePath,
  getContentType,
} = require("./src/util/requestUtil.js");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const pool = sql.createPool(config);

  const userRepository = new UserRepository({ pool });
  const userService = new UserService({ userRepository: userRepository, sendEmail });
  const userRoutes = routes({ userService: userService, reqToQuery });

  const extension = path.extname(req.url);
  const method = req.method;
  const { pathname } = url.parse(req.url);

  const contentType = getContentType(extension);
  const filePath = getFilePath(contentType, req.url, extension);
  console.log(filePath);
  const allRoutes = {
    ...userRoutes,

    default: async (req, res) => {
      if (fs.existsSync(filePath)) {
        await serveFile(filePath, contentType, res);
      } else {
        log(path.parse(filePath));
        await serveFile(
          path.join(__dirname, "views", "404.html"),
          "text/html",
          res
        );
      }
    },
  };

  const routeEndpoint = `${pathname}:${method.toLowerCase()}`;
  const chosenRoute = allRoutes[routeEndpoint] || allRoutes.default;

  return Promise.resolve(chosenRoute(req, res));
});

server.listen(PORT, () => log(`Server running on port ${PORT}`));