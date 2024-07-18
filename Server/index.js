import express, { response } from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import usersRouter from "./routes/users.routes.js";
import authRouter from "./routes/auth.routes.js";

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
app.use("/api/auth/login", authRouter);
app.listen(3000, () => {
  console.log("sever is running on port 3000...");
});
