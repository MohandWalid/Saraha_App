import { Types } from "mongoose";
import { Asynhadler } from "../utils/response.js";
import Joi from "joi";
import { ganderENum } from "../DB/model/user.collection.js";

export const generalFeild = {
  fullName: Joi.string().min(2).max(20).messages({
    "string.min": "min name length is 2 char",
    "any.required": "fullName is mandatory",
  }),

  phone: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/),
  confirmPassword: Joi.string().valid(Joi.ref("password")),

  email: Joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 3,
    tlds: { allow: ["net", "com"] },
  }),
  password: Joi.string().pattern(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  ),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)

    .messages({
      "string.empty": "OTP is required.",
      "string.length": "OTP must be exactly 6 digits.",
      "string.pattern.base": "OTP must contain only numbers.",
      "any.required": "OTP field is required.",
    }),

  id: Joi.string().custom((value, helper) => {
    return Types.ObjectId.isValid(value) || helper.message("In-valid ObjectId");
  }),

  gender: Joi.string().valid(...Object.values(ganderENum)),

  files: {
    fieldname: Joi.string().required(),

    originalname: Joi.string().required(),

    encoding: Joi.string().required(),

    mimetype: Joi.string().required(),

    filePath: Joi.string().required(),

    path: Joi.string().required(),

    destination: Joi.string().required(),

    filename: Joi.string().required(),

    size: Joi.number().positive().required(),
  },
};

export const validation = (schema) => {
  return Asynhadler(async (req, res, next) => {
    const validationError = [];
    for (const key of Object.keys(schema)) {
      const validationResult = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (validationResult.error) {
        validationError.push({
          key,
          details: validationResult.error.details.map((el) => {
            return { message: el.message, details: el.path[0] };
          }),
        });
      }
      if (validationError.length) {
        return res
          .status(400)
          .json({ err_message: "Validation error", validationError });
      }
    }

    return next();
  });
};
