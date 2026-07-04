import express, { type Express } from "express";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import { userRouter } from "./routes/user.route";

app.use("/api/user", userRouter);

app.get("/api/", (req, res) => {
  res.end("server is running");
});

export default app;
