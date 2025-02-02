import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect mongodb successfully")
    } catch (error) {
        throw error
    }
}
export default connectDB