import { Request, Response } from "express";
import Lesson from "../models/lessons";

export const getAllLessons = async (req: Request, res: Response) => {
  try {
    const allLessons = await Lesson.find({}).populate({
      path: "tutor",
    });

    if (allLessons.length <= 0) {
      res.status(404).send("Not found!");
    }

    res.status(200).send(allLessons);
  } catch (err) {
    res.status(500).send("Internal server error!");
    console.error(err);
  }
};
