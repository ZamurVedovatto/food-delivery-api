const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  favoritedKeys: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Keys'
  }],
  createdAt: String,
})

userSchema.virtual('id').get(function () {
  return this._id.toString();
});

const user = mongoose.model('User', userSchema)
module.exports = user;
