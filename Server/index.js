import express, { response } from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import usersRouter from "./routes/users.routes.js";
import authRouter from "./routes/auth.routes.js";
import carsRouter from "./routes/cars.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";

config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/cars", carsRouter);
app.use("/api/inquiries", inquiryRouter);
app.listen(3000, () => {
  console.log("sever is running on port 3000...");
});
