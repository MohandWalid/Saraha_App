import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      minLength: 2,
      maxLength: 2000000,
      required: function () {
        return this.attatchments?.length ? false : true;
      },
    },
    attatchments: [{ secure_url: String, public_id: String }],
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

export const messageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
