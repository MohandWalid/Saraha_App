import mongoose from "mongoose";
import {
  providerEnum,
  roleENum,
  userModel,
} from "../../DB/model/user.collection.js";
import { Asynhadler, successfullyResponse } from "../../utils/response.js";
import { findOne } from "../../DB/model/DB.service.js";
import * as DBService from "../../DB/model/DB.service.js";
import { compareSecurity, hashSecurity } from "../../security/hash.security.js";
import {
  encrptSecurity,
  decrptSecurity,
} from "../../security/encrpt.security.js";
import jwt from "jsonwebtoken";
import {
  generateToken,
  getNewCredentials,
  getSignture,
  sigtureLevelENUM,
} from "../../security/token.security.js";
import { OAuth2Client } from "google-auth-library";
import { emailEvent } from "../../utils/verifyemail/verify.email.js";
import { customAlphabet } from "nanoid";
import { expireOtp } from "../../security/expireOtp.js";
import * as validators from "./validation.js";

export const signup = Asynhadler(async (req, res, next) => {
  const { fullName, email, phone, password } = req.body;

  const otp = customAlphabet("0123456789", 6)();

  if (await DBService.findOne({ model: userModel, filter: { email } })) {
    return next(new Error("user is already exist", { cause: 409 }));
  }

  const encrptPhone = (await encrptSecurity({ data: phone })).toString();

  const confirmEmailHash = await hashSecurity({ plainText: otp });
  const user = await DBService.create({
    model: userModel,
    data: [
      {
        fullName,
        email,
        phone: encrptPhone,
        OTPHash: confirmEmailHash,
        expireOtp: expireOtp(),
        password: await hashSecurity({ plainText: password }),
        provider: providerEnum.system,
      },
    ],
  });

  emailEvent.emit("Confirm Email", {
    to: email,
    otp: otp,
  });
  return successfullyResponse({
    res,
    message: "Account  Create successfully ✅",
    status: 201,
    data: user,
  });
});

export const login = Asynhadler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await DBService.findOne({
    model: userModel,
    filter: { email, provider: providerEnum.system },
  });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (user.OTPHash) {
    return next(new Error("Please verify your account first ", { cause: 400 }));
  }

  const match = await compareSecurity({
    plainText: password,
    hash: user.password,
  });

  if (!match) {
    return next(new Error("Invalid email or password", { cause: 404 }));
  }

  if (user.deleteAt) {
    return next(new Error("This account is deleted"));
  }

  const credtional = await getNewCredentials({ user });

  return successfullyResponse({
    res,
    message: "Login successfully ✅",
    status: 200,
    data: {
      credtional,
    },
  });
});

export const confirmEmail = Asynhadler(async (req, res, next) => {
  const { otp, email } = req.body;

  const user = await DBService.findOne({
    model: userModel,
    filter: {
      email,
      confirmEmail: { $exists: false },
      OTPHash: { $exists: true },
    },
  });

  if (!user) {
    return next(
      new Error("In-Valid account or already verified", { cause: 404 }),
    );
  }

  if (Date.now() > user.expireOtp) {
    return next(new Error("OTP is expired "));
  }

  if (!(await compareSecurity({ plainText: otp, hash: user.OTPHash }))) {
    return next(new Error("In-valid otp"));
  }

  const updatedUser = await DBService.updateOne({
    model: userModel,
    filter: { email },
    data: {
      confirmEmail: Date.now(),
      $unset: { OTPHash: true, expireOtp: true },
      $inc: { __v: 1 },
    },
  });

  return updatedUser.matchedCount
    ? successfullyResponse({ res, status: 200, data: {} })
    : next(new Error("fail to confirm user email"));
});

async function verifyGoogleGmail({ idToken } = {}) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.googleClientId.split(","),
  });
  const payload = ticket.getPayload();

  return payload;
}

export const signupWithGmail = Asynhadler(async (req, res, next) => {
  const { idToken } = req.body;

  const { name, picture, email, email_verified } = await verifyGoogleGmail({
    idToken,
  });

  if (!email_verified) {
    return next(new Error("no verified account", { cause: 400 }));
  }

  const user = await DBService.findOne({
    model: userModel,
    filter: { email },
  });

  if (user) {
    if (user.provider === providerEnum.google) {
      return loginWithGmail(req, res, next);
    }

    return next(new Error("Email Exist", { cause: 409 }));
  }

  const [newuser] = await DBService.create({
    model: userModel,
    data: [
      {
        fullName: name,
        picture,
        email: email,
        comfirmEmail: Date.now(),
        provider: providerEnum.google,
      },
    ],
  });
  const credtional = await getNewCredentials({ user: newuser });

  return successfullyResponse({
    res,

    status: 201,
    data: { user: credtional },
  });
  // return successfullyResponse({
  //   res,
  //   message: "Account  Create successfully ✅",
  //   status: 201,
  //   data: { user: newuser._id },
  // });
});

export const loginWithGmail = Asynhadler(async (req, res, next) => {
  const { idToken } = req.body;

  const { email, email_verified } = await verifyGoogleGmail({
    idToken,
  });

  if (!email_verified) {
    return next(new Error("no verified account", { cause: 400 }));
  }

  const user = await DBService.findOne({
    model: userModel,
    filter: { email, provider: providerEnum.google },
  });

  if (!user) {
    return next(new Error("In-valid Login data", { cause: 404 }));
  }

  const credtional = await getNewCredentials({ user });

  return successfullyResponse({
    res,

    status: 200,
    data: { user: credtional },
  });
});

export const resntOTP = Asynhadler(async (req, res, next) => {
  const { email } = req.body;

  const user = await DBService.findOne({
    model: userModel,
    filter: {
      email,
      confirmEmail: { $exists: false },
      OTPHash: { $exists: true },
    },
  });

  if (!user) {
    return next(new Error("Invalid account or not verifed", { cause: 404 }));
  }

  if (Date.now() < user.otpNextRequest) {
    const wait = Math.ceil((user.otpNextRequest - Date.now()) / 1000);

    return next(
      new Error(`Please wait ${wait} seconds before requesting another OTP.`),
    );
  }

  const otp = customAlphabet("0123456789", 6)();

  let cooldown = 2 * 60 * 1000;
  if (user.otpAttempts >= 5) {
    cooldown = 5 * 60 * 1000;
  }

  const updateOTP = await DBService.updateOne({
    model: userModel,
    filter: { email },
    data: {
      OTPHash: await hashSecurity({ plainText: otp }),
      expireOtp: expireOtp(),
      otpAttempts: user.otpAttempts + 1,
      otpNextRequest: Date.now() + cooldown,
    },
  });

  emailEvent.emit("Confirm Email", {
    to: email,
    otp,
  });

  return successfullyResponse({
    res,
    message: "OTP sent successfully",
  });
});

export const sendForgotPassword = Asynhadler(async (req, res, next) => {
  const { email } = req.body;
  const otp = await customAlphabet("123456789", 6)();

  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: {
      email,
      // confirmEmail: { $exists: true },
      provider: providerEnum.system,
      deleteAt: { $exists: false },
    },
    data: {
      otpForgotPassword: await hashSecurity({ plainText: otp }),
    },
  });

  emailEvent.emit("SendForgotPassword", {
    to: email,
    subject: "Forgot password",
    title: "Reset-Password",
    otp,
  });

  return user
    ? successfullyResponse({ res, data: { user } })
    : next(new Error("In-valid account", { cause: 404 }));
});

export const verifyOTP = Asynhadler(async (req, res, next) => {
  const { otp, email } = req.body;

  const user = await DBService.findOne({
    model: userModel,
    filter: {
      email: email,
      // confirmEmail: { $exists: true },
      provider: providerEnum.system,
      deleteAt: { $exists: false },
      otpForgotPassword: { $exists: true },
    },
  });

  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }

  if (
    !(await compareSecurity({ plainText: otp, hash: user.otpForgotPassword }))
  ) {
    return next(new Error("Invalid-otp"));
  }

  return successfullyResponse({ res });
});

export const resetForgotPassword = Asynhadler(async (req, res, next) => {
  const { otp, email, newPassword, confirmPassword } = req.body;

  const user = await DBService.findOne({
    model: userModel,
    filter: {
      email: email,
      // confirmEmail: { $exists: true },
      provider: providerEnum.system,
      deleteAt: { $exists: false },
      otpForgotPassword: { $exists: true },
    },
  });

  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }

  if (
    !(await compareSecurity({ plainText: otp, hash: user.otpForgotPassword }))
  ) {
    return next(new Error("Invalid-otp"));
  }

  await DBService.updateOne({
    model: userModel,
    filter: {
      email,
    },
    data: {
      password: await hashSecurity({ plainText: password }),
      changeCredentialsTime: new Date(),
      $push: { oldPassword: password },
    },
  });
  return successfullyResponse({ res });
});
