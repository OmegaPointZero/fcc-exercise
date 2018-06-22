const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
}, {collection: 'users'})

module.exports = mongoose.model('User', userSchema)