import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { populateDB } from "./src/middlewares/populateDB";
import tutorRoutes from "./src/routes/tutorRoutes";
import lessonRoutes from "./src/routes/lessonRoutes";
import signupRoutes from "./src/routes/signupRoutes";
import loginRoutes from "./src/routes/loginRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3001;

// using middleware to keep code clean
app.get("/", populateDB, (req: Request, res: Response) => {
  res.send("on the server!");
});

// routes for tutors
app.use("/tutor", tutorRoutes);

// routes for lessons
app.use("/lesson", lessonRoutes);

// routes for login and signup
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);

const main = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI || "");
    app.listen(port, () => console.log(`server started on port ${port}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
