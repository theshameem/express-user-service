import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRouter } from "./modules/user/user.route";

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/users", userRouter);

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `);

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
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      `
      SELECT * FROM users 
      WHERE id=$1
      `,
      [id],
    );

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
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, age, email, password } = req.body;

  try {
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
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `DELETE FROM users
      WHERE id=$1`,
      [id],
    );

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
});
