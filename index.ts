import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser()) // giúp sử dụng cookie trong express

import routes from "./routes"
// Database
import "./configs/database"

// Routes
app.use(cors());

// app.use(function(req, res: any, next) {
//     res.header('Access-Control-Allow-Origin', "http://localhost:3000");
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });

app.use('/api', routes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})