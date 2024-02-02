import { StatusCodes } from 'http-status-codes'
import productModel from '~/models/productModel'
import ApiError from '~/utils/ApiError'
import { generateSlug, parseQueryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'
import { DISCOUNT_APPLY_TYPES, DISCOUNT_TYPES } from '~/utils/constants'
import discountRepo from '~/repositories/discountRepo'
import cloudinaryProvider from '~/providers/cloudinaryProvider'

const createNew = async (reqFiles, reqBody) => {
  try {
    const images = await cloudinaryProvider.uploadMultiple(reqFiles)
    return await productModel.create({
      ...reqBody,
      images,
      slug: generateSlug(reqBody.title)
    })
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create new product failed')
  }
}

const getProduct = async (id, reqQuery) => {
  try {
    const { fields } = parseQueryParams(reqQuery)

    const [product, discounts] = await Promise.all([
      productModel
        .findById(id)
        .populate('category', '-createdAt -updatedAt')
        .select(fields),
      discountRepo.findByProductIds([id], {
        products: 0,
        currentUsage: 0,
        maxUsage: 0,
        isActive: 0,
        createdAt: 0,
        updatedAt: 0
      })
    ])
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    const { totalPercentage, totalFixed } = discounts.reduce(
      (acc, discount) => {
        if (discount.type === DISCOUNT_TYPES.PERCENTAGE) {
          acc.totalPercentage += discount.value
        } else if (discount.type === DISCOUNT_TYPES.FIXED) {
          acc.totalFixed += discount.value
        }
        return acc
      },
      { totalPercentage: 0, totalFixed: 0 }
    )

    const priceApplyDiscount =
      product.price - totalFixed - (product.price * totalPercentage) / 100
    return {
      ...product.toObject(),
      oldPrice: discounts.length ? product.price : null,
      price: discounts.length ? priceApplyDiscount : product.price,
      discounts
    }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get product failed')
  }
}

const getProducts = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } = parseQueryParams(reqQuery)
    const [products, totalProducts] = await Promise.all([
      productModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit)
        .populate('category', '-createdAt -updatedAt'),
      productModel.countDocuments()
    ])
    const productIds = products.map((product) => product._id)
    const discounts = await discountRepo.findByProductIds(productIds, {
      currentUsage: 0,
      maxUsage: 0,
      isActive: 0,
      createdAt: 0,
      updatedAt: 0
    })

    const resProducts = products.map((product) => {
      const separateDiscounts = discounts.filter(
        (discount) =>
          discount.products?.find((productId) => productId.equals(product?._id)) ||
          discount.applyFor === DISCOUNT_APPLY_TYPES.ALL
      )

      const { totalPercentage, totalFixed } = separateDiscounts.reduce(
        (acc, discount) => {
          if (discount.type === DISCOUNT_TYPES.PERCENTAGE) {
            acc.totalPercentage += discount.value
          } else if (discount.type === DISCOUNT_TYPES.FIXED) {
            acc.totalFixed += discount.value
          }
          return acc
        },
        { totalPercentage: 0, totalFixed: 0 }
      )

      let priceApplyDiscount =
        product.price - totalFixed - (product.price * totalPercentage) / 100
      if (priceApplyDiscount < 0) priceApplyDiscount = 0

      return {
        ...product.toObject(),
        oldPrice: separateDiscounts.length ? product.price : null,
        price: separateDiscounts.length ? priceApplyDiscount : product.price
        // discounts: separateDiscounts.map(discount => ({ ...discount, products: undefined }))
      }
    })

    return {
      page,
      totalPages: calculateTotalPages(totalProducts, limit),
      totalProducts,
      products: resProducts
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get products failed')
  }
}

const updateProduct = async (id, reqFiles, reqBody) => {
  try {
    const updateData = reqBody.title
      ? {
        ...reqBody,
        slug: generateSlug(reqBody.title)
      }
      : { ...reqBody }
    const foundProduct = await productModel.findById(id)
    if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    const [images] = await Promise.all([
      cloudinaryProvider.uploadMultiple(reqFiles),
      cloudinaryProvider.deleteMultiple(foundProduct.images.map(image => image.id))
    ])

    const product = await productModel.findByIdAndUpdate(
      id,
      { ...updateData, images },
      { new: true }
    )
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update product failed')
  }
}

const deleteProduct = async (id) => {
  try {
    const product = await productModel.findByIdAndDelete(id)
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    await cloudinaryProvider.deleteMultiple(product.images.map(image => image.id))
    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update product failed')
  }
}

const rating = async (userId, { productId, star, comment }) => {
  try {
    const foundProduct = await productModel.findById(productId)
    if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

    let isRated = false
    const sumStar =
      foundProduct.ratings?.reduce((accumulator, rating) => {
        if (rating.postedBy.equals(userId)) {
          isRated = true
          return accumulator
        }
        return (accumulator += rating.star)
      }, 0) + star

    const numberRatings = foundProduct.ratings?.length
    let averageRatings = isRated ? sumStar / numberRatings : sumStar / numberRatings + 1

    let updatedProduct = null
    if (isRated) {
      updatedProduct = await productModel.findOneAndUpdate(
        { _id: productId, ratings: { $elemMatch: { postedBy: userId } } },
        {
          $set: { 'ratings.$.star': star, 'ratings.$.comment': comment, averageRatings }
        },
        { new: true }
      )
    } else {
      updatedProduct = await productModel.findOneAndUpdate(
        { _id: productId },
        {
          $push: { ratings: { star, comment, postedBy: userId } },
          $set: { averageRatings }
        },
        { new: true }
      )
    }
    if (!updatedProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return updatedProduct
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Rating failed')
  }
}

export default {
  createNew,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  rating
}
