import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URL}`)
    console.log(`DATABASE CONNECTED ${connectionInstance.connection.name}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDb
