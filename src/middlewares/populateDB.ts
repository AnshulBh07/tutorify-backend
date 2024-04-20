import { Request, Response, NextFunction } from "express";
import { IUser, ITutor, IReview } from "../data/interfaces";
import User from "../models/user";
import Tutor from "../models/tutor";
import { ObjectId } from "mongoose";
import { promises as fsPromises } from "fs";
import Lesson from "../models/lessons";

let usersArr: IUser[];
let tutorsArr: ITutor[];
let tutorsEmails: string[];
let reviewerEmails: string[];
let tutorIndex = 0,
  reviewerIndex = 0;

export const populateDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // first we read data and store in arrays
    let rawData = await fsPromises.readFile(
      "./src/data/usersData.json",
      "utf8"
    );
    let data = JSON.parse(rawData);
    usersArr = data.users;

    tutorsEmails = usersArr.slice(0, 8).map((item) => {
      return item.email;
    });

    reviewerEmails = usersArr.slice(8).map((item) => {
      return item.email;
    });

    // increase the size of reviewers because the leftover users are less than total number of reviews
    for (let i = 0; i < 5; i++) {
      reviewerEmails = [...reviewerEmails, ...reviewerEmails];
    }

    rawData = await fsPromises.readFile("./src/data/tutorsData.json", "utf8");
    data = JSON.parse(rawData);
    tutorsArr = data.tutors;

    console.log("JSON data parse successfully!");

    // console.log(
    //   tutorsArr.length,
    //   usersArr.length,
    //   reviewerEmails.length,
    //   tutorsEmails.length
    // );
    // alright at this point we have read all the data from both the files that are given
    // now we can use this data to populate the database
    if (usersArr && tutorsArr) {
      const userCount = await User.countDocuments({});
      // console.log(userCount);

      // only populate if the collection is empty
      if (userCount === 0) {
        usersArr.forEach(async (item) => {
          const newUser = new User({ ...item, otp: null, otp_expire: null });
          await newUser.save();
        });
      }

      const tutorCount = await Tutor.countDocuments({});
      // console.log(tutorCount);

      // only populate if tutor counts is 0
      if (tutorCount === 0) {
        // do not use forEach loops for async operations, it sucks LOL
        for (let i = 0; i < tutorsArr.length; i++) {
          // we must populate the objectID for each tutor and their reviewers manually,
          // let us use the email field for this as it is unique to each user
          // use tutor model to create teh structure of object to be inserted
          // we maintain two pointers tutorIndex and reviewerIndex
          // console.log(tutorsEmails[tutorIndex]);

          const tutorData = await User.findOne({
            email: tutorsEmails[tutorIndex].toLowerCase(),
          });

          // extract tutor id
          if (tutorData) {
            const tutorID: ObjectId = tutorData.id;

            // now find the userIDs for all the reviewers and store in an array
            const reviewArr: IReview[] = [];
            const n = tutorsArr[i].reviews.length;

            // console.log(tutorsArr[i].reviews);

            for (let j = 0; j < n; j++) {
              // console.log(reviewerEmails[reviewerIndex]);

              const reviewer = await User.findOne({
                email: reviewerEmails[reviewerIndex],
              });

              if (reviewer) {
                const reviewerID: ObjectId = reviewer.id;
                const review: IReview = {
                  rating: tutorsArr[tutorIndex].reviews[j].rating,
                  comment: tutorsArr[tutorIndex].reviews[j].comment,
                  reviewer: reviewerID,
                };
                reviewArr.push(review);
                reviewerIndex++;
              }
            }

            tutorIndex++;

            // console.log(reviewArr);

            // save everything in db
            const newTutor = new Tutor({
              ...tutorsArr[i],
              user: tutorID,
              reviews: reviewArr,
              auto_accept: true,
              instant_rate: true,
              available: true,
            });

            await newTutor.save();
          }
        }
      }

      rawData = await fsPromises.readFile(
        "./src/data/lessonsData.json",
        "utf8"
      );
      data = JSON.parse(rawData);
      const lessonsCount = await Lesson.countDocuments();

      if (lessonsCount === 0) {
        for (let i = 0; i < data.lessons.length; i++) {
          const newLesson = new Lesson(data.lessons[i]);
          await newLesson.save();
        }
      }

      next();
    }
  } catch (err) {
    res.status(200).send("Internal server error!");
    console.error(err);
  }
};
