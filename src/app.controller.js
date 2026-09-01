import express from "express";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import connectDB from "./DB/connect.DB.js";
import { globalErrorHandler } from "./utils/response.js";
import * as dotenv from "dotenv";
import path from "node:path";
import cors from "cors";
import { sendMail } from "./utils/sendemail.js";
import messageController from "./modules/message/message.controller.js";
import morgan from "morgan";

dotenv.config({ path: path.join("./src/config/.env.dev") });
const bootstrap = async (req, res, next) => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(morgan("dev"));
  //   connect DB
  await connectDB();
  app.use("/uploads", express.static(path.resolve("src/uploads")));
  //   convering buffer data
  app.use(express.json());

  //   app routing
  app.get("/", (req, res) => {
    res.json({ message: "Welcome 🥰" });
  });

  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/message", messageController);
  app.all("{/*dummy}", (req, res) => {
    res.status(404).json({ message: "In-valid Url 💥" });
  });

  app.use(globalErrorHandler);
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default bootstrap;
