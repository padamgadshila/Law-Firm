import express from "express";
import cors from "cors";
import morgan from "morgan";
import { notFound, errorHandler } from "./Middlewares/error.middleware.js";
import userRouter from "./routes/user.route.js";
import clientRouter from "./routes/client.route.js";
const app = express();

//use
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", clientRouter);

export default app;
