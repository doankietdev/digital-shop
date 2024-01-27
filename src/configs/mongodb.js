/* eslint-disable no-console */
import mongoose from 'mongoose'
import { BUID_MODE, MONGODB } from './environment'
import { DEV_ENV } from '~/utils/constants'

let dbInstance = null

export const connectDB = async () => {
  if (!dbInstance) {
    if (BUID_MODE === DEV_ENV) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    dbInstance = await mongoose.connect(MONGODB.URI, {
      dbName: MONGODB.DATABASE_NAME
    })
  }
  return dbInstance
}

export const closeDB = async () => {
  await mongoose.connection.close()
}
