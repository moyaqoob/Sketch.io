import express, { type Request, type Response } from "express";
const app = express();
const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "welcome to CoSketch",
  });
});

app.listen(PORT, () => {
  console.log(`[ server ] is listening on : http://localhost:${PORT}`);
});
