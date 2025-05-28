import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { dbConnection } from './src/config/db'
import authRouter from './src/routes/authRoutes'
import giftRouter from './src/routes/giftRoutes'
import videoRouter from './src/routes/videoRoutes'
import { AuthController } from './src/controller/authController'
import { AuthService } from './src/services/authService'
import { AuthRepository } from './src/repositories/authRepository'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
dbConnection()

app.use(cors({ origin: 'http://localhost:5173', credentials: true,allowedHeaders: ['Content-Type', 'Authorization'] }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const authRepository = new AuthRepository()
const authService = new AuthService(authRepository)
const authController = new AuthController(authService)

app.use('/auth', authRouter)
app.use('/gifts', giftRouter)
app.use('/videos', videoRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
