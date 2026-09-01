import jwt from "jsonwebtoken";
import { Asynhadler } from "../utils/response.js";
import * as DB_service from "../DB/model/DB.service.js";
import { userModel } from "../DB/model/user.collection.js";
import {
  decodeSigture,
  getSignture,
  tokenTypeENUM,
  verifyToken,
} from "../security/token.security.js";

export const authentication = ({ tokenType = tokenTypeENUM.access } = {}) => {
  return Asynhadler(async (req, res, next) => {
    const result = await decodeSigture({
      next,
      authorization: req.headers.authorization,
      tokenType,
    });

    if (!result) {
      return next(new Error("Invalid token", { cause: 401 }));
    }

    const { user, decode } = result;

    req.user = user;
    req.decode = decode;

    return next();
  });
};

export const authorization = ({
  accessRole = [],
  tokenType = tokenTypeENUM.access,
} = {}) => {
  return Asynhadler(async (req, res, next) => {
    const { user, decode } = await decodeSigture({
      next,
      authorization: req.headers.authorization,
      tokenType,
    });

    req.user = user;
    req.decode = decode;

    if (!accessRole.includes(req.user.role)) {
      return next(new Error("Not authorized account", { cause: 403 }));
    }
    return next();
  });
};
