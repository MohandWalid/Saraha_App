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
export const uploadFile = ({ customPath = "general", validation = [] }) => {
  let basePath = `/uploads/${customPath}`;

  const storage = multer.diskStorage({
    destination: function (req, file, cd) {
      const currentPath = req.user?._id
        ? `${basePath}/${req.user._id}`
        : basePath;

      const fullPath = path.resolve(`src/${currentPath}`);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      cd(null, path.resolve(fullPath));
    },

    filename: function (req, file, cd) {
      const uniqueFile =
        Date.now() + "__" + Math.random() + "__" + file.originalname;
      file.filePath = basePath + "/" + uniqueFile;
      cd(null, uniqueFile);
    },
  });

  const fileFilter = function (req, file, cb) {
    if (validation.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Invalid file format"), false);
  };

  return multer({
    dest: "./temp",
    fileFilter,
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
      fieldNameSize: 100,
    },
  });
};
