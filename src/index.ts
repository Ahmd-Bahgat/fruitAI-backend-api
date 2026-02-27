import express from 'express'
import dotenv from 'dotenv'
import connectDB from './configs/db'
import userRoute from './routes/userRoute'
import errorHandler from './middlewares/errorHandler'
dotenv.config()

connectDB()

const app = express()
const port = process.env.PORT

app.use(express.json())

app.use('/user', userRoute)

//middleware
app.use(errorHandler)


app.listen(port, () => {
    console.log(`server running on 0.0.0.0:${port}`)
})