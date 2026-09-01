import { validation } from "../../middleware/validation.middleware.js";
import * as authService from "./auth.service.js";
import { Router } from "express";
import * as validators from "./validation.js";
import { authentication } from "../../middleware/token.middleware.js";

const router = Router();

router.post("/signup", validation(validators.signup), authService.signup);

router.post("/login", validation(validators.login), authService.login);

router.post("/signup/gmail", authService.signupWithGmail);

router.post("/login/gmail", authService.loginWithGmail);

router.patch(
  "/confirm-email",
  validation(validators.confirmEmail),
  authService.confirmEmail,
);

router.patch("/resend-email", authService.resntOTP);

router.patch(
  "/sendForgotPassword",
  validation(validators.sendForgotPassword),
  authService.sendForgotPassword,
);

router.patch(
  "/verify-otp",
  validation(validators.verifyOtp),
  authService.verifyOTP,
);

router.patch(
  "/reset-forgot-password",
  validation(validators.resetForgotPassword),
  authService.resetForgotPassword,
);

export default router;
