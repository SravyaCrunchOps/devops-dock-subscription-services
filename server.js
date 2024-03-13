const express = require('express');
const cors = require('cors');
const config = require('./config');
const Subscribers = require('./subscriberModel');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const PORT = config.server.port;

const app = express();

// mongodb connection
const mongoUrl = config.database.mongoUrl;
const db = mongoose.connect(mongoUrl);

// middlewares
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
}));


app.use('/subscribe', async (req, res) => {
    console.log(req.body)
    const existingUser = await Subscribers.findOne({email: req.body.email});
    if(existingUser) {
        return res.send('Already regsitered to our newletter :)');
    }
    await Subscribers.create({email: req.body['email']})
    return res.send('Thank you for subscribing to our newsletter!!');
});

app.post('/send-mail', async (req, res) => {
    const { to, subject, html } = req.body
    const transporter = nodemailer.createTransport({
        host: 'smtppro.zoho.in',
        secure: true,
        port: 465,
        auth: {
            user: config.mail.email,
            pass: config.mail.password
        }
    });
    const mailOptions = {
        from: config.mail.email,
        to: to.email,
        subject: subject,
        html: html
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log("error in sending mail ", err)
        } else {
            return res.send("Sent mail successfully")
        }
    })
})

// PORT connection
if(db) {
    app.listen(PORT, (err, client) => {
        if(err) console.log(err.message)
        console.log('server connected at PORT: ', PORT)
        console.log('MongoDB database is connected.')
    });
}