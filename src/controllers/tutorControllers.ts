import { Response, Request } from "express";
import Tutor from "../models/tutor";
import { ITutor } from "../data/interfaces";

export const getAllTutors = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query;

    // as query params are totally optional the validation od these params is
    // to be done during filtering an sorting
    // if (queryParams) console.log(typeof queryParams.native_speaker);

    let tutors: ITutor[] = await Tutor.find({}).populate({
      path: "user",
      select: "-password -salt",
    });

    if (tutors.length <= 0) {
      res.status(400).send("Not found!");
    }

    // perform filtering of tutors

    // perform sorting of tutors only if a sort criteria is present in query params

    // paginate the results
    if (typeof queryParams.page !== "undefined")
      tutors = tutors.slice(
        Number(queryParams.page) * 4,
        Number(queryParams.page) * 4 + 4
      );

    console.log(tutors.length);
    res.status(200).send(tutors);
  } catch (err) {
    res.status(500).send("Internal server error!");
    console.error(err);
  }
};
