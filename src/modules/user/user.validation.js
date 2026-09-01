import { Types } from "mongoose";
import { generalFeild } from "../../middleware/validation.middleware.js";
import { logoutEnum } from "../../security/token.security.js";
import { typeOfFile } from "../../utils/multer/local.multer.js";
import Joi from "joi";

export const sharedProfileValidation = {
  params: Joi.object({
    userId: generalFeild.id.required(),
  }),
};

export const logOut = {
  body: Joi.object({
    flag: Joi.string()
      .valid(...Object.values(logoutEnum))
      .default(logoutEnum.stayLogin),
  }).required(),
};

export const updateBasicInfo = {
  body: Joi.object({
    fullName: generalFeild.fullName,
    phone: generalFeild.phone,
    gender: generalFeild.gender,
  }),
};

export const freezeAccount = {
  params: Joi.object({
    _id: generalFeild.id,
  }),
};

export const restoreAccount = {
  params: Joi.object({
    userId: generalFeild.id,
  }),
};

export const deleteAccount = {
  params: Joi.object({
    _id: generalFeild.id,
  }),
};

export const updatePassword = {
  body: logOut.body.append({
    oldPassword: generalFeild.password.required(),
    newPassword: generalFeild.password
      .invalid(Joi.ref("oldPassword"))
      .required(),
    confirmPassword: generalFeild.password
      .valid(Joi.ref("newPassword"))
      .required(),
  }),
};

export const uploadValidation = {
  files: Joi.array()
    .items(
      Joi.object({
        fieldname: generalFeild.files.fieldname.valid("images"),

        originalname: generalFeild.files.originalname,

        encoding: generalFeild.files.encoding,

        mimetype: generalFeild.files.mimetype.valid(
          ...Object.values(typeOfFile.image),
        ),

        // filePath: generalFeild.files.filePath,

        path: generalFeild.files.path,

        destination: generalFeild.files.destination,

        filename: generalFeild.files.filename,

        size: generalFeild.files.size,
      }),
    )
    .min(1)
    .max(2)
    .required(),
};

export const profileValidation = {
  file: Joi.object({
    fieldname: generalFeild.files.fieldname.valid("image"),

    originalname: generalFeild.files.originalname,

    encoding: generalFeild.files.encoding,

    mimetype: generalFeild.files.mimetype.valid(
      ...Object.values(typeOfFile.image),
    ),

    path: generalFeild.files.path,

    destination: generalFeild.files.destination,

    filename: generalFeild.files.filename,

    size: generalFeild.files.size,
  }).required(),
};
