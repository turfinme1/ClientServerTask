const {
  reqToQuery,
  serveFile,
  getFilePath,
  getContentType,
  createResponse,
} = require("../requestUtil");
const path = require("path");

describe("requestUtil", () => {
  describe("reqToQuery", () => {
    test("should return empty string representation of empty request body", async () => {
      const req = {
        [Symbol.asyncIterator]: () => ({
          next: () => Promise.resolve({ done: true }),
        }),
      };

      const result = await reqToQuery(req);

      expect(result).toBe("");
    });
  });

  describe("serveFile", () => {
    test("should return internal server error if file is not found", async () => {
      const filePath = "scr\\views\\404.html";
      const contentType = "text/html";
      const response = {
        writeHead: jest.fn(),
        end: jest.fn(),
        statusCode: 0,
      };

      await serveFile(filePath, contentType, response);

      expect(response.statusCode).toBe(500);
      expect(response.end).toHaveBeenCalledTimes(1);
    });
    test("should return the file content with the given status code and content type", async () => {
      const filePath = path.join(__dirname, "..", "..", "views", "index.html");
      const contentType = "text/html";
      const response = {
        writeHead: jest.fn(),
        end: jest.fn(),
      };

      await serveFile(filePath, contentType, response);

      expect(response.writeHead).toHaveBeenCalledWith(200, {
        "Content-Type": contentType,
      });
      expect(response.end).toHaveBeenCalledTimes(1);
    });
    test("should return the file content as JSON if content type is application/json", async () => {
      const filePath = path.join(__dirname, "..", "..", "..", "package.json");
      const contentType = "application/json";
      const response = {
        writeHead: jest.fn(),
        end: jest.fn(),
      };

      await serveFile(filePath, contentType, response);

      expect(response.writeHead).toHaveBeenCalledWith(200, {
        "Content-Type": contentType,
      });
      expect(response.end).toHaveBeenCalledTimes(1);
    });
  });

  describe("getFilePath", () => {
    test("should return the path to the index.html file", () => {
      const contentType = "text/html";
      const reqUrl = "/";
      const extension = ".html";

      const result = getFilePath(contentType, reqUrl, extension);

      expect(result).toMatch("\\src\\views\\index.html");
    });
    test("should return the path to the file with the given extension", () => {
      const contentType = "text/html";
      const reqUrl = "login";
      const extension = ".html";

      const result = getFilePath(contentType, reqUrl, extension);

      expect(result).toMatch(`\\src\\views\\${reqUrl}`);
    });
    test("should return a path for a file when content type is not text/html", () => {
      const contentType = "application/json";
      const reqUrl = "data";
      const extension = ".json";

      const result = getFilePath(contentType, reqUrl, extension);

      expect(result).toMatch(`\\src\\${reqUrl}`);
    });
    test("should add .html extension to the file path if extension is empty", () => {
      const contentType = "text/html";
      const reqUrl = "about";
      const extension = "";

      const result = getFilePath(contentType, reqUrl, extension);

      expect(result).toMatch(`\\src\\views\\${reqUrl}.html`);
    });
  });

  describe("getContentType", () => {
    test("should return the content type of .css extension", () => {
      const extension = ".css";

      const result = getContentType(extension);

      expect(result).toBe("text/css");
    });
    test("should return the content type of .json extension", () => {
      const extension = ".json";

      const result = getContentType(extension);

      expect(result).toBe("application/json");
    });
    test("should return the content type of .js extension", () => {
      const extension = ".js";

      const result = getContentType(extension);

      expect(result).toBe("text/javascript");
    });
    test("should return the default type of with no extension match", () => {
      const extension = ".html";
      const extension2 = "";

      const result = getContentType(extension);
      const result2 = getContentType(extension2);

      expect(result).toBe("text/html");
      expect(result2).toBe("text/html");
    });
  });

  describe("createResponse", () => {
    test("should return a response with the given status code and message", () => {
      const res = {
        writeHead: jest.fn(),
        end: jest.fn(),
      };
      const statusCode = 401;
      const message = "Unauthorized";

      createResponse(res, statusCode, message);

      expect(res.writeHead).toHaveBeenCalledWith(statusCode, {
        "Content-Type": "application/json",
      });
      expect(res.end).toHaveBeenCalledWith(
        JSON.stringify({
          message,
        })
      );
      expect(res.writeHead).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledTimes(1);
    });
  });
});
