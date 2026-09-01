import { roleENum } from "../../DB/model/user.collection.js";

export const endpoint = {
  profile: [roleENum.admin, roleENum.user],
  restoreAccount: [roleENum.admin],
};
