import express from "express";
import { test, signup, signin, me } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";

const authRouter = express.Router();

authRouter.post("/test", test);
authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/me", auth, me);

export default authRouter;
