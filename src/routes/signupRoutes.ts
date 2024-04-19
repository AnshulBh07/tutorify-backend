import express from "express";
import { addUser } from "../controllers/signupControllers";
const router = express.Router();

router.post("/", addUser);

export default router;
