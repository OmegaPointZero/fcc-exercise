const mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
  username: String,
  exercise: String,
  duration: Number,
  date: Number
}, {collection: 'exercises'})

module.exports = mongoose.model('Log', logSchema)