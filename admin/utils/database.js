
import mongoose from "mongoose"
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {

            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbname:'SNSF'

        })
    } catch {
        throw new Error("MongoDB connection failed")
    }

}
