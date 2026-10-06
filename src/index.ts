import express from "express";
import { env } from "./config/env";
import healthRouter from "./modules/health/health.router";
import userRouter from "./modules/users/users.router";
import { db } from "./db";

const app = express();

app.use(express.json());

// Routes
app.use("/api", healthRouter);
app.use("/api/users", userRouter);

app.listen(env.PORT, () => {
  console.log(
    `[server]: Running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`,
  );
});
