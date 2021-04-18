const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  filename: String,
  createdAt: String
})

imageSchema.virtual('id').get(function () {
  return this._id.toString();
});

const ImageModel = mongoose.model('Image', imageSchema)
module.exports = ImageModel;
