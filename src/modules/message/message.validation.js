import Joi from "joi";
import { generalFeild } from "../../middleware/validation.middleware.js";
import { typeOfFile } from "../../utils/multer/cloudinary.multer.js";

export const sendMessage = {
  parames: Joi.object({
    receiverId: generalFeild.id.required(),
  }),

  body: Joi.object({
    content: Joi.string().min(2).max(200000),
  }).required(),

  files: Joi.array()
    .items(
      Joi.object({
        fieldname: generalFeild.files.fieldname.valid("attatchments"),

        originalname: generalFeild.files.originalname,

        encoding: generalFeild.files.encoding,

        mimetype: generalFeild.files.mimetype.valid(
          ...Object.values(typeOfFile.image),
        ),

        path: generalFeild.files.path,

        destination: generalFeild.files.destination,

        filename: generalFeild.files.filename,

        size: generalFeild.files.size,
      }),
    )
    .min(0)
    .max(2),
};
