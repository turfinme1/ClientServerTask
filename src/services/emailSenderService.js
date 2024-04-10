const { MailtrapClient } = require("mailtrap");

const client = new MailtrapClient({
  token: "058fcfd94b32f0ba003ceafef0e369e8",
});

const sender = { name: "Mailtrap", email: "info@demomailtrap.com" };

const sendEmail = async (emailReceiver, validationToken) => {
  try {
    await client.send({
      from: sender,
      to: [{ email: `zzzturfzzz@gmail.com` }],
      subject: "Confirmation of email",
      text: `Please confirm your email by clicking the link below : http://localhost:3000/confirm?validationToken=${validationToken}`,
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Email not sent to ${emailReceiver}`);
  }
};

exports.sendEmail = sendEmail;
