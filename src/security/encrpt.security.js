// import CryptoJS from "crypto-js";

// export const encrptSecurity = async ({ data = "", secretKey = null }) => {
//   secretKey = secretKey || process.env.ENCRYPTION_SECRET;
//   return await CryptoJS.AES.encrypt(data, secretKey);
// };

// export const decrptSecurity = async ({ data = "", secretKey = null }) => {
//   secretKey = secretKey || process.env.ENCRYPTION_SECRET;
//   return await CryptoJS.AES.decrypt(data, secretKey).toString(
//     CryptoJS.enc.Utf8,
//   );
// };

import CryptoJS from "crypto-js";

export const encrptSecurity = async ({ data = "", secretKey = null }) => {
  secretKey = secretKey || process.env.ENCRYPTION_SECRET;

  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decrptSecurity = async ({ data = "", secretKey = null }) => {
  secretKey = secretKey || process.env.ENCRYPTION_SECRET;

  return CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
};
