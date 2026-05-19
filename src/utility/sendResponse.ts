import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  message: string;
  success: boolean;
  error?: any;
  data?: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    message: data.message,
    success: data.success,
    data: data.data,
    error: data.error,
  });
};

export default sendResponse;
