import multer from "multer";
import path from "node:path";
import fs from "fs";

export const typeOfFile = {
  image: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ],

  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ],
};
export const cloudinaryUploadFile = ({ validation = [] }) => {
  const storage = multer.diskStorage({});

  const fileFilter = function (req, file, cb) {
    if (validation.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Invalid file format"), false);
  };

  return multer({
    fileFilter,
    storage,
  });
};
