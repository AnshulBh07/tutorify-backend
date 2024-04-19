import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body;

    // validate req body
    if (
      typeof email === "undefined" ||
      email === "" ||
      typeof password === "undefined" ||
      password === "" ||
      typeof remember === "undefined"
    ) {
      res.status(400).send("Bad request.");
      return;
    }

    // authenticate user by extracting salt, hashed pass from users schema for the user
    const user = await User.findOne({ email: email });

    // user not found
    if (!user) {
      res.status(404).send("User not found, please create an account.");
      return;
    }

    // user found , validate password
    const pwd_hash = user.password;
    const salt = user.salt;

    const currHash = bcrypt.hashSync(password, salt);

    if (pwd_hash !== currHash) {
      res.status(401).send("Unauthorized, Invalid login");
      return;
    }

    // everything has been validated, so now we generate tokens and send back to client
    const payload = {
      id: user._id,
      email: user.email,
    };

    const access_key = process.env.ACCESS_KEY || "";
    const access_token = jwt.sign(payload, access_key, { expiresIn: "1h" });

    const refresh_key = process.env.REFRESH_KEY || "";
    const refresh_token = jwt.sign(payload, refresh_key, { expiresIn: "1d" });

    // if remember me is selected generate a persistent token
    let persistent_key = process.env.PERSISTENT_KEY || "";
    let persistent_token = "";

    if (Boolean(remember)) {
      persistent_token = jwt.sign(payload, persistent_key, { expiresIn: "7d" });
    }

    res
      .status(200)
      .send({
        user_info: user,
        access_token: access_token,
        refresh_token: refresh_token,
        persistent_token: persistent_token,
      });
  } catch (err) {
    res.status(500).send("Internal server error.");
    console.error(err);
  }
};
