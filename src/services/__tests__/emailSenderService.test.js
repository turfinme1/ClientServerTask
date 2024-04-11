const { sendEmail } = require("../emailSenderService");
const { MailtrapClient } = require("mailtrap");

jest.mock("mailtrap");

const mockClient = {
  send: jest.fn(),
};

const mockMailtrapClient = jest.fn().mockImplementation(() => {
  return mockClient;
});

describe("emailSenderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("sendEmail", () => {
    test("send email should be called once", async () => {
      await sendEmail("abv@abv.bg", "text");
      expect(mockClient.send).toHaveBeenCalledTimes(1);
    });
    test("send email should throw an error when email is not sent", async () => {
      mockClient.send.mockRejectedValue(new Error("Error"));

      await expect(sendEmail("abv@abv.bg", "text")).rejects.toThrow();
    });
  });
});
