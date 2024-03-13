require('dotenv').config();

const config = {
    server: {
        port: process.env.PORT
    },
    database: {
        mongoUrl: process.env.MONGODB_URL
    },
    mail: {
        email: process.env.ZOHO_MAIL,
        password: process.env.ZOHO_PASSWORD
    }
}

module.exports = config;