import * as DbService from "../DB/model/DB.service.js";
import { userModel } from "../DB/model/user.collection.js";
import { Asynhadler } from "../utils/response.js";

export const expireOtp = () => {
  const expireOtp = Date.now() + 2 * 60 * 1000;

  return expireOtp;
};
