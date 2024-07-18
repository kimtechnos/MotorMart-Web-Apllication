import express, { response } from "express";
import { config } from "dotenv";
import cors from "cors";
import usersRouter from "./routes/users.routes.js";

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
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", usersRouter);
app.listen(3000, () => {
  console.log("sever is running on port 3000...");
});
