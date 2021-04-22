const {  UserInputError } = require('apollo-server')
const { validateProductInput } = require('./../../util/validators')
const ProductModel = require('./../../models/Product')

module.exports = {
  Query: {
    async getProducts() {
      try {
        const products = await ProductModel.find().sort({ title: 1 })
        return products
      } catch (err) {
        throw new Error(err)
      }
    },
		async getActiveProducts() {
      try {
        const products = await ProductModel.find({ active: true }).sort({ title: 1 })
        return products
      } catch (err) {
        throw new Error(err)
      }
    },
    async getProduct(_, { productId }) {
      try {
        const product = await ProductModel.findOne( {"_id": productId })
        if(product) return product
        else throw new Error('Product not found')
      } catch (error) {
        throw new Error(error)
      }
    }
  },
  Mutation: {
    async createProduct(_, {
      title,
      description,
      price,
    }, context) {
			// insert image after product's creation
			const { valid, errors } = validateProductInput(title, description, price)
			if(!valid) {
				throw new UserInputError('Errors', { errors })
			}
			// make sure product doesn't already exists
			const findProduct = await ProductModel.findOne({ title })
			if(findProduct) {
				throw new UserInputError('product is taken', {
					errors: {
						product: 'This product is taken'
					}
				})
			}
			const newProduct = new ProductModel({
				title,
				description,
				price,
				createdAt: new Date().toISOString()
			})
			return await newProduct.save()
    },
    async deleteProduct(_, { productId }, context) {
			try {
				const product = await ProductModel.findOne({ "_id": productId })
				await product.delete()
				return 'product deleted successfully'
			} catch(err) {
				throw new Error(err)
			}
    },
    async toggleActiveProduct(_, { productId }, context) {
			const selectedProduct = await ProductModel.findById(productId)
			if(selectedProduct) {
				selectedProduct.active = !selectedProduct.active
				await selectedProduct.save()
				return selectedProduct
			} else {
				throw new UserInputError('product not found')
			}
    }
  }
}
