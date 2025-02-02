import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB from "./util/db.js"
dotenv.config({})
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(urlencoded({extended: true}))

const corsOptions = {
    origin: 'http://localhost:5173',
    credential: true
}

app.use(cors(corsOptions))

app.listen(process.env.PORT || 8000, () => {
    connectDB()
    console.log(`Server is running port ${process.env.PORT}`)
})