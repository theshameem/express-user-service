import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUser = async (payload: IUser) => {
  const { name, age, email, password, role } = payload;

  const hashedPassword = await bcrypt.hash(password, 13); // Implement password hashing here

  const result = await pool.query(
    `
    INSERT INTO users(name, age, email, password, role)
    VALUES($1, $2, $3, $4, COALESCE($5, 'user'))
    RETURNING *
    `,
    [name, age, email, hashedPassword, role],
  );

  delete result.rows[0].password;

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
  delete result?.rows[0].password;
  return result;
};

const updateUserById = async (id: string, payload: IUser) => {
  const { name, age, email, password, role } = payload;
  const result = await pool.query(
    `
      UPDATE users
      SET name=COALESCE($1, name), 
      age=COALESCE($2, age), 
      email=COALESCE($3, email), 
      password=COALESCE($4, password), 
      role=COALESCE($5, role)
      updated_at=NOW()
      WHERE id=$5
      RETURNING *
      `,
    [name, age, email, password, id, role],
  );

  delete result.rows[0].password;

  return result;
};

const deleteUserById = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM users
      WHERE id=$1`,
    [id],
  );

  delete result.rows[0].password;

  return result;
};

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
