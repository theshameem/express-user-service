import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
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

  // 3. generate jwt access token

  const jwtpayload = {
    email: userInfo.email,
    id: userInfo.id,
    is_active: userInfo.is_active,
    name: userInfo.name,
    role: userInfo.role,
  };

  const accessToken = jwt.sign(jwtpayload, config.jwt_secret as string, {
    expiresIn: "20m",
  });

  // 4. generate jwt refresh token

  const refreshToken = jwt.sign(
    jwtpayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: "1d",
    },
  );

  return { accessToken, refreshToken };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(
    token as string,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const userData = await pool.query(
    `
     SELECT * FROM users WHERE email=$1   
        `,
    [decoded.email],
  );

  const user = userData.rows[0];

  if (userData.rows.length === 0) {
    throw new Error("User not found!!");
  }

  if (!user?.is_active) {
    throw new Error("Forbidden!!");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtpayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUser,
  generateRefreshToken,
};
