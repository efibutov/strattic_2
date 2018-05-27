#!/usr/bin/env node

const http = require('http');
const url = require('url');
const nodemailer = require('nodemailer');

const port = 3000;
const mail_to = "support@strattic.com";
const service = 'strattic';
const sender = 'support@strattic.com';
const username = 'support';
const password = '******';

const sendMailToSupport = (msg) => {
    let transporter = nodemailer.createTransport({
        service: service,
        auth: {
            user: username,
            pass: password
        }
    });

    let mailOptions = {
        from: sender,
        to: mail_to,
        subject: 'GET params',
        text: JSON.stringify(msg)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

};

const requestHandler = (request, response) => {
    if (request.method === 'GET') {
        let url_parts = url.parse(request.url, true);
        let query = url_parts.query;
        let msg = {};
        const keys = ['email', 'phone_number', 'message'];

        try {
            keys.forEach((key) => {
                if (key in query) {
                    msg[key.toString().toUpperCase()] = query[key];
                }
                else {
                    throw `${key} was not in original message`;
                }
            });
            console.log(msg);
            sendMailToSupport(msg);
        }
        catch (e) {
            console.log('No appropriate key', e);
        }
        response.writeHead(200);
        response.end();
    }
};


const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('ERROR:', err)
    }
    console.log(`server is listening on ${port}`)
});
