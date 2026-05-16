import express, { type Application } from "express";
import { profileRouter } from "./modules/profile/profile.route";
import { userRouter } from "./modules/user/user.route";

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/users", userRouter); // Routes for user
app.use("/api/profile", profileRouter); // Routes for profile
