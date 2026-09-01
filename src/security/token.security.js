import jwt from "jsonwebtoken";
import * as DB_service from "../DB/model/DB.service.js";
import { roleENum, userModel } from "../DB/model/user.collection.js";
import { nanoid } from "nanoid";
import { tokenModel } from "../DB/model/Token.collection.js";
export const tokenTypeENUM = { access: "access", refresh: "refresh" };
export const sigtureLevelENUM = { bearer: "Bearer", system: "System" };
export const logoutEnum = {
  signOutFromAll: "signOutFromAll",
  signOut: "signOut",
  stayLogin: "stayLogin",
};

export const generateToken = async ({
  payload = {},
  signture = process.env.ACCESS_USER_SIGBATURE,
  option = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  },
}) => {
  return await jwt.sign(payload, signture, option);
};

export const verifyToken = async ({
  token = "",
  signture = process.env.ACCESS_USER_SIGBATURE,
}) => {
  return await jwt.verify(token, signture);
};

export const getSignture = async ({
  signtureLevel = sigtureLevelENUM.bearer,
} = {}) => {
  const signture = {
    accessSignture: undefined,
    refreshSignture: undefined,
  };

  switch (signtureLevel) {
    case sigtureLevelENUM.system:
      signture.accessSignture = process.env.ACCESS_SYSTEM_SIGBATURE;
      signture.refreshSignture = process.env.REFRESH_SYSTEM_SIGBATURE;
      break;
    default:
      signture.accessSignture = process.env.ACCESS_USER_SIGBATURE;
      signture.refreshSignture = process.env.REFRESH_USER_SIGBATURE;
  }
  return signture;
};

export const decodeSigture = async ({
  next,
  authorization = "",
  tokenType = tokenTypeENUM.access,
} = {}) => {
  if (!authorization) {
    return next(new Error("Token is required", { cause: 401 }));
  }

  const [bearer, token] = (authorization || "").split(" ") || [];

  if (!bearer || !token) {
    return next(new Error("In-valid Token", { cause: 401 }));
  }

  const signture = await getSignture({ signtureLevel: bearer });
  const selectedSignture =
    tokenType === tokenTypeENUM.refresh
      ? signture.refreshSignture
      : signture.accessSignture;

  const decode = await verifyToken({
    token,
    signture: selectedSignture,
  });

  const userId = decode?.id || decode?._id;
  if (!userId) {
    return next(new Error("Invalid-token", { cause: 400 }));
  }

  if (
    decode.jti &&
    (await DB_service.findOne({
      model: tokenModel,
      filter: { jti: decode.jti },
    }))
  ) {
    return next(new Error("In-valid login credentials", { cause: 401 }));
  }

  const user = await DB_service.findById({ model: userModel, id: userId });
  if (!user) {
    return next(new Error("user Not Register", { cause: 404 }));
  }

  if (user.changeCredentialsTime?.getTime() > decode.iat * 1000) {
    return next(new Error("In-valid login credital", { cause: 401 }));
  }

  return { user, decode };
};

export const getNewCredentials = async ({ user }) => {
  const signture = await getSignture({
    signtureLevel:
      user.role != roleENum.user
        ? sigtureLevelENUM.system
        : sigtureLevelENUM.bearer,
  });
  const jwtid = nanoid();

  const access_token = await generateToken({
    payload: { id: user._id },
    signture: signture.accessSignture,
    option: {
      jwtid,
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    },
  });

  const refresh_token = await generateToken({
    payload: { id: user._id },
    signture: signture.refreshSignture,
    option: { jwtid, expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) },
  });

  return { access_token, refresh_token };
};

export const createRvokeToken = async (req = {}) => {
  await DB_service.create({
    model: tokenModel,
    data: [
      {
        jti: req.decode.jti,
        expireIn: req.decode.iat + Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
        userId: req.decode.id,
      },
    ],
  });
};
