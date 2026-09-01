import { Asynhadler, successfullyResponse } from "../../utils/response.js";
import * as DBService from "../../DB/model/DB.service.js";
import {
  providerEnum,
  roleENum,
  userModel,
} from "../../DB/model/user.collection.js";
import {
  decrptSecurity,
  encrptSecurity,
} from "../../security/encrpt.security.js";
import {
  createRvokeToken,
  generateToken,
  getNewCredentials,
  getSignture,
  logoutEnum,
  sigtureLevelENUM,
} from "../../security/token.security.js";
import { confirmEmail } from "../auth/validation.js";
import { compareSecurity, hashSecurity } from "../../security/hash.security.js";
import { customAlphabet } from "nanoid";
import { emailEvent } from "../../utils/verifyemail/verify.email.js";
import { tokenModel } from "../../DB/model/Token.collection.js";
import {
  cloud,
  deleteFolder,
  destroyFiles,
  destroyImageProfile,
  uploadFiles,
  uploadProfileImage,
} from "../../utils/multer/cloud.js";

export const user = Asynhadler(async (req, res, next) => {
  const user = await DBService.findById({
    model: userModel,
    id: req.user._id,
    populate: [{ path: "messages" }],
  });

  user.phone = await decrptSecurity({ data: req.user.phone });

  return successfullyResponse({ res, data: { user: user } });
});

export const sharedProfile = Asynhadler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await DBService.findOne({
    model: userModel,
    filter: {
      _id: userId,
      OTPHash: { $exists: false },
    },
  });

  return user
    ? successfullyResponse({ res, data: { user } })
    : next(new Error("In-valid account", { cause: 404 }));
});

export const getNewLoginCredentials = Asynhadler(async (req, res, next) => {
  const credtional = await getNewCredentials({ user: req.user });

  return successfullyResponse({
    res,
    message: "Login successfully ✅",
    status: 200,
    data: {
      credtional,
    },
  });
});

export const updateUserProfile = Asynhadler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = await encrptSecurity({ data: req.body.phone });
  }

  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: req.user._id,
    },
    data: req.body,
  });

  return user
    ? successfullyResponse({ res, data: { user } })
    : next(new Error("In-valid account", { cause: 404 }));
});

export const freezeAccount = Asynhadler(async (req, res, next) => {
  const { userId } = req.params;

  if (userId && req.user.role !== roleENum.admin) {
    return next(new Error("no authratzatin", { cause: 403 }));
  }

  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: userId || req.user._id,
      deleteAt: { $exists: false },
    },
    data: {
      deleteAt: Date.now(),
      deleteBy: req.user._id,

      $unset: {
        restoreAt: 1,
        restoreBy: 1,
      },
    },
  });

  return user
    ? successfullyResponse({ res, data: { user } })
    : next(new Error("In-valid account", { cause: 404 }));
});

export const deleteAccount = Asynhadler(async (req, res, next) => {
  const { userId } = req.params;

  if (userId && req.user.role !== roleENum.admin) {
    return next(new Error("no authratzatin", { cause: 403 }));
  }

  const user = await DBService.findOneAndDelete({
    model: userModel,
    filter: {
      _id: userId || req.user._id,
      deleteAt: { $exists: true },
    },
  });

  if (user) {
    await deleteFolder({ prefix: `/user/${userId}` });
    return successfullyResponse({ res, data: { user } });
  }

  return next(new Error("In-valid account", { cause: 404 }));
});

export const restoreAccount = Asynhadler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: userId,
      deleteAt: { $exists: true },
    },
    data: {
      $unset: {
        deleteAt: 1,
        deleteBy: 1,
      },

      restoreAt: Date.now(),
      restoreBy: req.user._id,
    },
  });

  return user
    ? successfullyResponse({ res, data: { user } })
    : next(new Error("In-valid account", { cause: 404 }));
});

export const updatePassword = Asynhadler(async (req, res, next) => {
  const { oldPassword, newPassword, flag } = req.body;

  if (
    !(await compareSecurity({
      plainText: oldPassword,
      hash: req.user.password,
    }))
  ) {
    return next(new Error("In-valid Password"));
  }

  if (req.user.oldPassword?.length) {
    for (const password of req.user.oldPassword) {
      if (await compareSecurity({ plainText: newPassword, hash: password }))
        return next(new Error("this password is used before"));
    }
  }

  let updateCredentails = {};
  switch (flag) {
    case logoutEnum.signOutFromAll:
      updateCredentails.changeCredentialsTime = new Date();
      break;
    case logoutEnum.signOut:
      await createRvokeToken(req);
      break;
    default:
      break;
  }

  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: req.user._id,
    },
    data: {
      password: await hashSecurity({ plainText: newPassword }),
      ...updateCredentails,
      $push: { oldPassword: req.user.newPassword },
    },
  });

  return user
    ? successfullyResponse({ res, data: { user } })
    : next(new Error("In-valid account", { cause: 404 }));
});

export const logout = Asynhadler(async (req, res, next) => {
  const { flag } = req.body;

  switch (flag) {
    case logoutEnum.signOutFromAll:
      await DBService.updateOne({
        model: userModel,
        filter: {
          _id: req.decode.id,
        },
        data: {
          changeCredentialsTime: new Date(),
        },
      });
      break;
    default:
      await createRvokeToken(req);
      break;
  }

  return successfullyResponse({ res, status: 201, data: {} });
});

export const uploadImage = Asynhadler(async (req, res, next) => {
  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: { image: req.file.filePath },
  });

  return successfullyResponse({ res, data: { user } });
});

export const coverImage = Asynhadler(async (req, res, next) => {
  const attatchment = await uploadFiles({
    files: req.files,
    path: `user/${req.user._id}/cover`,
  });

  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: { cover: attatchment },
    options: {
      returnDocument: "before",
    },
  });

  if (user?.cover?.length) {
    await destroyFiles({
      public_ids: user.cover.map((file) => file.public_id),
    });
  }

  return successfullyResponse({
    res,
    data: {
      file: attatchment,
    },
  });
});

export const profileImage = Asynhadler(async (req, res, next) => {
  const { secure_url, public_id } = await uploadProfileImage({
    file: req.file,
    path: `user/${req.user._id}`,
  });

  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: { picture: { secure_url, public_id } },
    options: {
      returnDocument: "before",
    },
  });

  if (user?.picture?.public_id) {
    await destroyImageProfile({ public_id: user.picture.public_id });
  }

  return successfullyResponse({ res, data: { user } });
});
