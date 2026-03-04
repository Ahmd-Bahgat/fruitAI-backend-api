import express from "express";
import dotenv from "dotenv";

import connectDB from "./configs/db";
import userRoute from "./routes/userRoute";
import errorHandler from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { connectRedis } from "./configs/redis";

dotenv.config();

connectDB();
connectRedis()

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.static("uploads"));


app.use("/api", userRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on 0.0.0.0:${port}`);
});
