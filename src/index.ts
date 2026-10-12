import express from "express";
import { db } from "./db";
import { env } from "./config/env";
import healthRouter from "./modules/health/health.router";
import userRouter from "./modules/users/users.router";
import ticketRouter from "./modules/tickets/tickets.router";
import { errorHandeler } from "./shared/middlewares/error.middleware";

const app = express();

app.use(express.json());

// Routes
app.use("/api", healthRouter);
app.use("/api/users", userRouter);
app.use("/api/tickets", ticketRouter);



// Global Error Handeler 
app.use(errorHandeler)
app.listen(env.PORT, () => {
  console.log(
    `[server]: Running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`,
  );
});
