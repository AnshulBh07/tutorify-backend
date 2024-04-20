import express from "express";
import {
  changeUserPassword,
  generateOTPForUser,
  loginUser,
  validateUserOTP,
} from "../controllers/loginControllers";
const router = express.Router();

router.post("/", loginUser);

router.post("/generate_otp", generateOTPForUser);

router.post("/validate_otp", validateUserOTP);

router.post("/change_password", changeUserPassword);

export default router;
