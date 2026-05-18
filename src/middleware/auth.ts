import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized access!!",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string,
      ) as JwtPayload;

      const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        decoded.email,
      ]);

      if (userData.rowCount == 0) {
        res.status(404).json({
          success: false,
          message: "User not found!!",
        });
      }

      const user = userData.rows[0];
      if (!user.is_active) {
        res.status(403).json({
          success: false,
          message: "Forbidden!!",
        });
      }

      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden!! User do not have access of the resource",
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
