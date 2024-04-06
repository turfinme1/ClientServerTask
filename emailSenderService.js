const { MailtrapClient } = require("mailtrap");

const client = new MailtrapClient({
  token: "058fcfd94b32f0ba003ceafef0e369e8",
});

const sender = { name: "Mailtrap", email: "info@demomailtrap.com" };

const sendEmail = async (emailReceiver, content) => {
  try {
    await client.send({
      from: sender,
      to: [{ email: `zzzturfzzz@gmail.com` }],
      subject: "Confirmation of email",
      text: `Please confirm your email by clicking the link below : http://localhost:3000/confirm?validationToken=${content}`,
    });
  } catch (error) {
    console.log(error);
  }
  // client
  //   .send({
  //     from: sender,
  //     to: [{ email: `zzzturfzzz@gmail.com` }],
  //     subject: "Confirmation of email",
  //     text: `Please confirm your email by clicking the link below : http://localhost:3000/confirm/${content}`,
  //   })
  //   .then(console.log)
  //   .catch(console.error);
};

exports.sendEmail = sendEmail;
