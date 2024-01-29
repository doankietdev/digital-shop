import { StatusCodes } from 'http-status-codes'
import productModel from '~/models/productModel'
import ApiError from '~/utils/ApiError'
import slugify from 'slugify'
import { query } from 'express'
import { queryParams } from '~/utils/formatter'
import { calculateTotalPages } from '~/utils/util'

const createNew = async (reqBody) => {
  try {
    return await productModel.create({
      ...reqBody,
      slug: slugify(`${reqBody.title}-${Date.now()}`, { lower: true, locale: 'vi', strict: true })
    })
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create new product failed')
  }
}

const getProduct = async (id) => {
  try {
    const product = await productModel.findById(id)
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get product failed')
  }
}

const getProducts = async (reqQuery) => {
  try {
    const { query, sort, fields, skip, limit, page } = queryParams(reqQuery)
    const [products, totalProducts] = await Promise.all([
      productModel
        .find(query)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit),
      productModel.countDocuments()
    ])
    return {
      page,
      totalPages: calculateTotalPages(totalProducts, limit),
      totalProducts,
      products
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Get products failed')
  }
}

const updateProduct = async (id, reqBody) => {
  try {
    const updateData = reqBody.title ? {
      ...reqBody,
      slug: slugify(`${reqBody.title}-${Date.now()}`, {
        lower: true, locale: 'vi', strict: true
      })
    } : { ...reqBody }
    const product = await productModel.findByIdAndUpdate(
      id,
      updateData,
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
    return product
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Update product failed')
  }
}

const rating = async (userId, { productId, star, comment }) => {
  const foundProduct = await productModel.findById(productId)
  if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

  const sumStar = foundProduct.ratings?.reduce((accumulator, rating) => {
    if (rating.postedBy.equals(userId)) return accumulator
    return accumulator += rating.star
  }, 0) + star

  const isRatedUser = foundProduct.ratings?.some(rating => rating.postedBy.equals(userId))

  const numberRatings = foundProduct.ratings?.length
  let averageRatings = isRatedUser
    ? sumStar / numberRatings
    : sumStar / numberRatings + 1

  let updatedProduct = null
  if (isRatedUser) {
    updatedProduct = await productModel.findOneAndUpdate(
      { _id: productId, ratings: { $elemMatch: { postedBy: userId } } },
      { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment, averageRatings } },
      { new: true }
    )
  } else {
    updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $push: { ratings: { star, comment, postedBy: userId } }, $set: { averageRatings } },
      { new: true }
    )
  }
  if (!updatedProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

  return updatedProduct
}

export default {
  createNew,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  rating
}