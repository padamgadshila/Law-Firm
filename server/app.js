import express from "express";
import cors from "cors";
import morgan from "morgan";
import { notFound, errorHandler } from "./Middlewares/error.middleware.js";
import userRouter from "./routes/user.route.js";
import clientRouter from "./routes/client.route.js";
import timeout from "connect-timeout";
const app = express();

//use
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(express.static("uploads"));
app.use(cors());
app.use(morgan("dev"));
app.use(timeout("20000"));
app.use((req, res, next) => {
  if (req.timedout) {
    return res.status(408).json({ error: "Request timed out" });
  }
  next();
});
app.disable("x-powered-by");
app.use("/api", userRouter);
app.use("/api", clientRouter);
export default app;
