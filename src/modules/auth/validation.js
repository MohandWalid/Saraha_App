import Joi from "joi";
import { generalFeild } from "../../middleware/validation.middleware.js";

export const login = {
  body: Joi.object({
    email: generalFeild.email.required(),
    password: generalFeild.password.required(),
  })
    .required()
    .options({ allowUnknown: false }),
};

export const signup = {
  body: login.body
    .append({
      fullName: generalFeild.fullName.required(),
      phone: generalFeild.phone.required(),

      confirmPassword: generalFeild.confirmPassword.required(),
    })
    .required()
    .options({ allowUnknown: false }),

  query: Joi.object({
    lang: Joi.string().valid("ar", "en").required(),
  }),
};

export const confirmEmail = {
  body: Joi.object({
    email: generalFeild.email.required(),
    otp: generalFeild.otp.required(),
  })
    .required()
    .options({ allowUnknown: false }),

  // query: Joi.object({
  //   lang: Joi.string().valid("ar", "en").required(),
  // }),
};

export const sendForgotPassword = {
  body: Joi.object({
    email: generalFeild.email.required(),
  }),
};

export const verifyOtp = {
  body: sendForgotPassword.body.append({
    otp: generalFeild.otp.required(),
  }),
};
export const resetForgotPassword = {
  body: verifyOtp.body.append({
    newPassword: generalFeild.password.required(),
    confirmPassword: generalFeild.password.valid(Joi.ref("newPassword")),
    email: generalFeild.email.required(),
  }),
};
