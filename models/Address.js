const { Schema, model } = require('mongoose')

const types = [
  "house",
  "apartment",
  "commercial"
]

const addressSchema = new Schema({
  code: {
    required: true,
    type: String
  },
  type: {
    required: true,
    type: String,
    enum: types,
    default: 'house'
  },
  street: String,
  number: Number,
  complement: String,
  neighborhood: String,
  city: {
    type: String,
    default: 'Belo Horizonte'
  },
  country: {
    type: String,
    default: 'Brasil'
  },
  asKey: {
    type: Boolean,
    default: false
  },
  userId: String,
})

addressSchema.virtual('id').get(function () {
  return this._id.toString();
});

const address = model('Address', addressSchema)
module.exports = address;