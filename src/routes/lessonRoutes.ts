import express from "express";
import { getAllLessons } from "../controllers/lessonControllers";
const router = express.Router();

router.get("/", getAllLessons);

export default router;
