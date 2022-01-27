import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import routes from "./routes"
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Database
import "./configs/database"

// Routes
app.use('/api', routes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})