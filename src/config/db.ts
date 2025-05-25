import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
export const dbConnection=async():Promise<void>=>{
    try {
        const mongoURI=process.env.MONGOURI
        await mongoose.connect(mongoURI as string)
    } catch (error) {
        console.error("Failed to connect to mongodb!")
    }
}