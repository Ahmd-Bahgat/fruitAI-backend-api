import express from 'express'
import dotenv from 'dotenv'
import connectDB from './configs/db'
dotenv.config()

connectDB()

const app = express()
const port = process.env.PORT

app.use(express.json())


app.listen(port, () => {
    console.log(`server running on 0.0.0.0:${port}`)
})