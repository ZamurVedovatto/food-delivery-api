const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  body: String,
  type: String,
  destination: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }
})

postSchema.virtual('id').get(function () {
  return this._id.toString();
});

const post = mongoose.model('Post', postSchema)
module.exports = post;
