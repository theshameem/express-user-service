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

const getAllUsers = async () => {
  const result = await pool.query(`
      SELECT * FROM users
      `);

  return result;
};

const getUserById = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users 
      WHERE id=$1
      `,
    [id],
  );
  return result;
};

const updateUserById = async (id: string, payload: IUser) => {
  const { name, age, email, password } = payload;
  const result = await pool.query(
    `
      UPDATE users
      SET name=COALESCE($1, name), 
      age=COALESCE($2, age), 
      email=COALESCE($3, email), 
      password=COALESCE($4, password), 
      updated_at=NOW()
      WHERE id=$5
      RETURNING *
      `,
    [name, age, email, password, id],
  );

  return result;
};

const deleteUserById = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM users
      WHERE id=$1`,
    [id],
  );

  return result;
};

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
