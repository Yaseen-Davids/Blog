let mongoose = require('mongoose');

// Articles Schema
let postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
})

let Post = module.exports = mongoose.model('Post', postSchema);