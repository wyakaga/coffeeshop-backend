const fs = require('fs');
const mustache = require('mustache');
const { dirname, join } = require('path');

const createTransporter = require('../configs/nodemailer');

const sendEmail = async ({ to, subject, otp, client, user }) => {
  try {
    const data = { to, subject, otp, client, user };
    const templatesPath = join(
      dirname(__filename),
      '..',
      'html',
      'forgot.html'
    );

    const templates = fs.readFileSync(templatesPath, 'utf8');
    const mailOptions = {
      from: `no-reply <no-reply@${client}>`,
      to: data.to,
      subject: data.subject,
      text: `Here's the otp code for resetting your password : ${data.otp}. Ignore if you didn't request this`,
      html: mustache.render(templates, { ...data }),
    };

    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
