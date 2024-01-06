import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL, {
        })
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error(error)
        process.exit()
    }
}

export default connectDB