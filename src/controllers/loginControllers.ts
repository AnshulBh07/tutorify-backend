import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { SENDMAIL } from "../mail/mailService";

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

    res.status(200).send({
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

export const generateOTPForUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (typeof email === "undefined" || email === "") {
      res.status(400).send("Bad request.");
      return;
    }

    // find user with the given email
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).send("User not found, please create an account.");
      return;
    }

    // generate otp and save in user db with expiration date
    let currDate = new Date();
    const expiry = new Date(currDate.getTime() + 5 * 60000);

    const otp = Math.floor(Math.random() * 100000000);

    // now we update the record in db
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { otp: otp, otp_expire: expiry } }
    );

    // extract otp from db and send, this is done to prevent errors due to server interruptions
    const newUser = await User.findOne({ email: email });
    let otpCode = "";

    if (newUser && newUser.otp) {
      otpCode = newUser.otp.toString();
    }

    const options = {
      from: "roc8assignment@gmail.com",
      to: email,
      subject: "OTP for registration.",
      html: `
      <h2>Your One-Time Password (OTP)</h2>
      <p>Your OTP is: <strong>${otpCode}</strong></p>
      <p>Please use this OTP to verify your account.</p>
    `,
    };

    await SENDMAIL(options);

    res.status(200).send("OTP generated successfully");
  } catch (err) {
    res.status(500).send("Internal server error!");
    console.error(err);
  }
};

export const validateUserOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (
      typeof email === "undefined" ||
      email === "" ||
      typeof otp === "undefined" ||
      otp === ""
    ) {
      res.status(400).send("Bad request.");
      return;
    }

    // find user with the given email
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).send("User not found, please create an account.");
      return;
    }

    // extract user otp and expiry date
    const userOtp = user.otp;
    const userOtp_expiry = user.otp_expire;
    const currTime = Date.now() / 1000;

    // console.log(userOtp, userOtp_expiry!.getTime() / 1000, currTime);

    // if user otp is present and is not expired
    if (userOtp) {
      if (userOtp.toString() === otp.toString()) {
        // if the otp match check for expiry time
        if (userOtp_expiry) {
          if (currTime > userOtp_expiry.getTime() / 1000) {
            res
              .status(401)
              .send("Unauthorized, OTP expired, please try again.");
            return;
          } else {
            res.status(200).send("OTP verified successfully");
            return;
          }
        }
      }
    }

    res.status(401).send("Unauthorized, Invalid OTP");
  } catch (err) {
    res.status(500).send("Internal server error.");
    console.error(err);
  }
};

export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email === "undefined" ||
      email === "" ||
      typeof password === "undefined" ||
      password === ""
    ) {
      res.status(400).send("Bad request.");
      return;
    }

    // find user with the given email
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).send("User not found, please create an account.");
      return;
    }

    // user is present in db, update their password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: hash, salt: salt } }
    );

    res.status(200).send("ok");
  } catch (err) {
    res.status(500).send("Internal server error.");
    console.error(err);
  }
};
