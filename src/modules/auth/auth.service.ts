import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "./../../config/index";

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  // 1. check if user exists
  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (userData.rowCount == 0) {
    throw new Error("Invalid credentials");
  }

  const userInfo = userData?.rows[0];

  // 2. compare password with the user password
  const isMatchedPassword = await bcrypt.compare(password, userInfo.password);
  if (!isMatchedPassword) {
    throw new Error("Invalid credentials");
  }

  // 3. generate jwt

  const jwtpayload = {
    email: userInfo.email,
    id: userInfo.id,
    is_active: userInfo.is_active,
    name: userInfo.name,
    role: userInfo.role,
  };

  var accessToken = jwt.sign(jwtpayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUser,
};
