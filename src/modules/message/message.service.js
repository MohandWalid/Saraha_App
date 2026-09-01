import { messageModel } from "../../DB/model/message.db.js";
import * as DBServie from "../../DB/model/DB.service.js";
import { Asynhadler, successfullyResponse } from "../../utils/response.js";
import { userModel } from "../../DB/model/user.collection.js";
import { uploadFiles } from "../../utils/multer/cloud.js";

export const sendMessage = Asynhadler(async (req, res, next) => {
  const { receiverId } = req.params;
  const { content } = req.body;
  const attatchments = [];

  if (!req.body.content && !req.files) {
    return next(new Error("message content is required", { cause: 400 }));
  }

  if (
    !(await DBServie.findOne({
      model: userModel,
      filter: {
        _id: receiverId,
        deleteAt: { $exists: false },
        // confirmEmail: { $exists: true },
      },
    }))
  ) {
    return next(new Error("In-valid recipient account", { cause: 404 }));
  }

  if (req.files) {
    attatchments.push(
      ...(await uploadFiles({
        files: req.files,
        path: `message/${receiverId}`,
      })),
    );
  }

  const [message] = await DBServie.create({
    model: messageModel,
    data: [
      {
        attatchments,
        content,
        receiverId,
        senderId: req.user?._id,
      },
    ],
  });
  return successfullyResponse({ res, status: 201, data: { message } });
});
