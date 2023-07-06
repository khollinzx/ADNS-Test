const path = require('path');
const ejs = require('ejs');
const { mailgunDomain, mailgunKey, mailgunSenderEmail, mailgunSender} = require('../../../config');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(mailgunKey)

module.exports = class MailgunService {
    constructor() {
        this.msg = {
            from: `${mailgunSenderEmail}`, // Use the email address or domain you verified above  to: 'foo@example.com, bar@example.com',
        };
    }

    sendEmail = async (messageData) => {
        try {
            const {subject, userEmail, userName, template, variables} = messageData;
            // variables.name = userName;
            this.msg.html = await ejs.renderFile(path.join(__dirname, `../../views/emails/${template}.ejs`), {variables}, {async: true});
            this.msg.to = userEmail;
            this.msg.subject = subject;
            const mail = await sgMail.send(this.msg);
            console.log(mail)
        } catch (error) {
            console.error(error);
        }
    }
};
