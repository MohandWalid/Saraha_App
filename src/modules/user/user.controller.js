import {
  authentication,
  authorization,
} from "../../middleware/token.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { tokenTypeENUM } from "../../security/token.security.js";
import { endpoint } from "./user.authorization.js";
import * as userService from "./user.service.js";
import { Router } from "express";
import { sharedProfileValidation } from "./user.validation.js";
import * as validators from "./user.validation.js";
import { typeOfFile, uploadFile } from "../../utils/multer/local.multer.js";
import { cloudinaryUploadFile } from "../../utils/multer/cloudinary.multer.js";

const router = Router();

router.get(
  "/",
  authentication(),
  authorization({ accessRole: endpoint.profile }),
  userService.user,
);

router.get(
  "/token-refresh",
  authentication({ tokenType: tokenTypeENUM.refresh }),
  userService.getNewLoginCredentials,
);

router.post(
  "/logout",
  authentication(),
  validation(validators.logOut),
  userService.logout,
);

router.get(
  "/:userId",
  validation(sharedProfileValidation),
  userService.sharedProfile,
);

router.patch(
  "/",
  authentication(),
  validation(validators.updateBasicInfo),
  userService.updateUserProfile,
);

router.delete(
  "/:userId/freeze-account",
  authentication(),
  validation(validators.freezeAccount),
  userService.freezeAccount,
);

router.delete(
  "/:userId/delete-account",
  authentication(),
  validation(validators.deleteAccount),
  userService.deleteAccount,
);

router.patch(
  "/:userId/restore-account",
  authentication(),
  authorization({ accessRole: endpoint.restoreAccount }),
  validation(validators.restoreAccount),
  userService.restoreAccount,
);

router.patch(
  "/update-password",
  authentication(),
  validation(validators.updatePassword),
  userService.updatePassword,
);

router.patch(
  "/upload-file",
  authentication(),
  uploadFile({ customPath: "User", validation: typeOfFile.image }).single(
    "image",
  ),
  userService.uploadImage,
);

router.patch(
  "/upload-cover-file",
  authentication(),
  cloudinaryUploadFile({ validation: typeOfFile.image }).array("images", 2),
  validation(validators.uploadValidation),
  userService.coverImage,
);

router.patch(
  "/profile-image",
  authentication(),
  cloudinaryUploadFile({ validation: typeOfFile.image }).single("image"),

  validation(validators.profileValidation),
  userService.profileImage,
);

export default router;
