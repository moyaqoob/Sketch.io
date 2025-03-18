import express, { type Request, type Response } from "express";
import { PORT } from "./config/env";
const app = express();

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "welcome to COSKETCH",
  });
});

app.listen(PORT, () => {
  console.log(`[ server ] is listening on : http://localhost:${PORT}`);
});
