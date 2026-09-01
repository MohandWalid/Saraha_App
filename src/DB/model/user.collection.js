import mongoose from "mongoose";

export const ganderENum = { male: "male", female: "female" };
export const roleENum = { user: "user", admin: "admin" };
export const providerEnum = { system: "System", google: "google" };

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 2,
      maxLength: [20, "max length is 20 char"],
      required: true,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: [20, "max length is 20 char"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === providerEnum.system ? true : false;
      },
    },
    role: {
      type: String,
      enum: Object.values(roleENum),

      default: roleENum.user,
    },
    gander: {
      type: String,
      enum: {
        values: Object.values(ganderENum),
        message: `Gender allow only ${Object.values(ganderENum).join(" or ")}`,
      },
      default: ganderENum.male,
    },
    phone: {
      type: String,
      required: function () {
        return this.provider === providerEnum.system ? true : false;
      },
    },
    comfirmEmail: Date,
    OTPHash: String,
    picture: String,
    expireOtp: Date,
    deleteAt: Date,
    changeCredentialsTime: Date,
    image: String,
    oldPassword: [String],
    otpForgotPassword: String,
    cover: [{ secure_url: String, public_id: String }],
    picture: { secure_url: String, public_id: String },
    deleteBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restoreAt: Date,
    restoreBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    otpAttempts: {
      type: Number,
      default: 0,
    },

    otpNextRequest: {
      type: Number,
      default: 0,
    },

    provider: {
      type: String,
      enum: Object.values(providerEnum),
      default: providerEnum.google,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("fullName")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return this.firstName + " " + this.lastName;
  });

userSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "receiverId",
});

export const userModel =
  mongoose.models.User || mongoose.model("user", userSchema);
userModel.syncIndexes();
