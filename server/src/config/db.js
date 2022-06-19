const mongoose = require("mongoose");

const connect = async () => {
    return new mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
}

module.exports = {connect}