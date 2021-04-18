const mongoose = require('mongoose')

const modalities = [
  "single",
  "multiple"
]

const messageSchema = new mongoose.Schema({
  modality: {
    required: true,
    type: String,
    enum: modalities,
    default: 'single'
  },
  targetKey: String,
  body: String,
  senderId: String,
  senderKey: String,
  read: {
    type: Boolean,
    default: false
  },
  received: {
    type: Boolean,
    default: false
  },
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
  ]
})

messageSchema.virtual('id').get(function () {
  return this._id.toString();
});

const message = mongoose.model('Message', messageSchema)
module.exports = message;
