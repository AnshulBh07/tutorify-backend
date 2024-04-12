import { Request, Response } from "express";
import Lesson from "../models/lessons";

export const getAllLessons = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;

    if (typeof page !== "string" || page === "") {
      res.status(400).send("Bad request!");
      return;
    }

    let allLessons = await Lesson.find({});
    const totalLen = allLessons.length;

    if (allLessons.length <= 0) {
      res.status(404).send("Not found!");
    }

    if (page) {
      const pageNum = Number(page) - 1;
      allLessons = allLessons.slice(pageNum * 9, pageNum * 9 + 9);
    }

    res.status(200).send({ lessons: allLessons, number_of_lessons: totalLen });
  } catch (err) {
    res.status(500).send("Internal server error!");
    console.error(err);
  }
};
