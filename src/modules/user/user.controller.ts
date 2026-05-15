import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      data: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();

    res.status(200).json({
      isSuccess: true,
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      isSuccess: false,
      message: error.message,
      error: error,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await userService.getUserById(id as string);

    if (result.rowCount == 0) {
      return res.status(404).json({
        isSuccess: false,
        data: result.rows,
        message: "User not found.",
      });
    }

    res.status(200).json({
      isSuccess: true,
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      isSuccess: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUserById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await userService.updateUserById(id as string, req.body);

    if (result.rowCount === 0) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      data: result.rows[0],
      message: "User updated successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      isSuccess: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await userService.deleteUserById(id as string);

    if (result.rowCount == 0) {
      return res.status(404).json({
        success: false,
        message: "No user found with the provided id",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Delete successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
