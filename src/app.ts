import express, { type Application } from "express";
import { profileRouter } from "./modules/profile/profile.route";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.router";
import logger from "./middleware/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";

export const app: Application = express();

const corsOptions = {
  origin: "http://localhost:5000",
};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(logger);
app.use(cors(corsOptions));

app.use("/api/users", userRouter); // Routes for user
app.use("/api/profile", profileRouter); // Routes for profile
app.use("/api/auth", authRouter); // Routes for auth

app.use(globalErrorHandler);
