import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, path.join(process.cwd(), "..", "public", "assets", "images"));
  },
  filename: function (request, file, cb) {
    cb(null, new Date().toISOString().replaceAll(":", "-") + file.originalname);
  },
});

export const uploadImage = multer({
  storage,
  fileFilter: (request, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Just support images"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});
