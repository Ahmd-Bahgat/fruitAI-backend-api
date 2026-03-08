import express from "express";
import dotenv from "dotenv";

import connectDB from "./configs/db";
import userRoute from "./routes/userRoute";
import classificationRoute from "./routes/classificationRoute";
import errorHandler from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { connectRedis } from "./configs/redis";
import { createUploadPath } from "./controllers/classificationController";

dotenv.config();

const port = process.env.PORT;

connectDB();
connectRedis();

createUploadPath()

const app = express();

app.use(express.json());
app.use(express.static("uploads"));

app.use("/api", userRoute);
app.use("/api", classificationRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on 0.0.0.0:${port}`);
});
