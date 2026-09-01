import express from "express";
import {
  cloudinaryUploadFile,
  typeOfFile,
} from "../../utils/multer/cloudinary.multer.js";

import * as messageService from "../../modules/message/message.service.js";
import * as validators from "../message/message.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authentication } from "../../middleware/token.middleware.js";

const router = express.Router();

router.post(
  "/:receiverId",
  cloudinaryUploadFile({ validation: typeOfFile.image }).array(
    "attatchments",
    2,
  ),
  validation(validators.sendMessage),
  messageService.sendMessage,
);

router.post(
  "/:receiverId/sender",
  authentication(),
  cloudinaryUploadFile({ validation: typeOfFile.image }).array(
    "attatchments",
    2,
  ),
  validation(validators.sendMessage),
  messageService.sendMessage,
);

export default router;
