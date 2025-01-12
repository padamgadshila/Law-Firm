import express from "express";
import cors from "cors";
import morgan from "morgan";
const app = express();

//use
app.use(cors());
app.use(morgan("common"));
app.use(express.json());

export default app;
