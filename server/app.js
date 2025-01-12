import express from "express";
import cors from "cors";
import morgan from "morgan";
import { notFound, errorHandler } from "./Middlewares/error.middleware.js";
const app = express();

//use
app.use(cors());
app.use(morgan("common"));
app.use(express.json());
// app.use(notFound());
// app.use(errorHandler());

export default app;
