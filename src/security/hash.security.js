import bcrypt from "bcrypt";

export const hashSecurity = async ({ plainText = "", SALT = null }) => {
  SALT = SALT || process.env.SALT;
  return await bcrypt.hashSync(plainText, parseInt(SALT));
};

export const compareSecurity = async ({ plainText = "", hash = "" } = {}) => {
  return await bcrypt.compareSync(plainText, hash);
};
