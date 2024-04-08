import express from "express";
import { getAllTutors } from "../controllers/tutorControllers";
const router = express.Router();

router.get("/", getAllTutors);

export default router;
