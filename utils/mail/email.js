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

const sendMail = async (participant, subject, html) => {
    mailOptions.to = participant.email;
    mailOptions.subject = subject;
    mailOptions.html = html;

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
    });
}


module.exports = {
    transporter: transporter,
    mailOptions: mailOptions,
    sendMail: sendMail
};