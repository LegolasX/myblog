const Mongoose = require('mongoose');

let usersSchema = new Mongoose.Schema({
    title: String,
    author: String,
    body: String,
    intro: String,
    createTime: {
        type: Date,
        default: Date.now
    },
    publish: Boolean
});