const { createTransport } = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  try {
    const service = process.env.MAIL_SERVICE;
    const type = process.env.MAIL_AUTH_TYPE;
    const user = process.env.MAIL_USER;
    const clientId = process.env.MAIL_CLIENT_ID;
    const clientSecret = process.env.MAIL_CLIENT_SECRET;
    const refreshToken = process.env.MAIL_REFRESH_TOKEN;

    const oauth2Client = new OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log('*ERR: ', err);
          reject();
        }
        resolve(token);
      });
    });

    const transporter = createTransport({
      service,
      auth: {
        type,
        user,
        accessToken,
        clientId,
        clientSecret,
        refreshToken,
      },
    });
    return transporter;
  } catch (err) {
    console.log(err);
  }
};

module.exports = createTransporter;
