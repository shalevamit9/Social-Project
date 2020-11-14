const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    // to: 'receiver email',
    // subject: 'some subject',
    // html: `html code`
};

module.exports = {
    transporter: transporter,
    mailOptions: mailOptions
};