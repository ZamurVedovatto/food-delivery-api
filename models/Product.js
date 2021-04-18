const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: String,
  active: {
    type: Boolean,
    default: true
  },
  image: {
		type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
	createdAt: String,
})

productSchema.virtual('id').get(function () {
  return this._id.toString();
});

const ProductModel = mongoose.model('Product', productSchema)
module.exports = ProductModel
