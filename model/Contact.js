const mongoose = require('mongoose')
const Schema = mongoose.Schema

var Contact = new Schema({
    owner: {
        type: String
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String
    },
    tel:{
        type: Number
    },
    address:{
        type: String
    }
})
  
module.exports = mongoose.model('Contact', Contact)