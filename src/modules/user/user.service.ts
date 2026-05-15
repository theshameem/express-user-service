import type { IUser } from "./user.interface";
import { pool } from "../../db";

const createUser = async (payload: IUser) => {
  const { name, age, email, password } = payload;

  const result = await pool.query(
    `
    INSERT INTO users(name, age, email, password)
    VALUES($1, $2, $3, $4)
    RETURNING *
    `,
    [name, age, email, password],
  );

  return result;
};

export const userService = {
  createUser,
};
