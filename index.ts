import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { dbConnection } from './src/config/db'
import authRouter from './src/routes/authRoutes'
require('dotenv').config()
const app=express()
dbConnection()
app.use(cors({origin:'http://localhost:5173',credentials:true}))
app.use(express.json())
app.use(cookieParser())
app.use(authRouter())
const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log("Server is running!")
})