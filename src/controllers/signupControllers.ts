import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

export const addUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (
      typeof first_name === "undefined" ||
      first_name === "" ||
      typeof email === "undefined" ||
      email === "" ||
      typeof password === "undefined" ||
      password === ""
    ) {
      res.status(400).send("Bad request");
      return;
    }

    // let us find the user by email, as email is unique
    const user = await User.findOne({ email: email });

    if (user) {
      res.status(400).send("User already exists");
      return;
    }

    // if no existing user, insert into users collection
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      first_name: first_name,
      last_name: last_name ? last_name : null,
      email: email,
      password: hash,
      salt: salt,
      dob: null,
      isTutor: false,
      phone_number: null,
      address: null,
      profile_pic: null,
      gender: null,
      otp: null,
      otp_expire: null,
    });

    await newUser.save();

    res.status(200).send(newUser);
  } catch (err) {
    res.status(500).send("Internal server error");
    console.error(err);
  }
};
