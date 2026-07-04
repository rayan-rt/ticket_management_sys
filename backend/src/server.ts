import express, { type Express } from "express";
import cookieParser from "cookie-parser";
// import { globalRateLimit } from "./middlewares/rate_limit.middleware";
// --

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(globalRateLimit);

import { userRouter } from "./routes/user.route";

app.use("/api/user", userRouter);

app.get("/api/", (req, res) => {
  res.end("server is running");
});

export default app;
