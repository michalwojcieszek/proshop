import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    //null pertains to an error
    cb(null, "uploads/");
  },
  //how we want the file to be formatted
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image Uploaded",
    //replaced because I got "\" in the URL
    image: `/${req.file.path.replace(/\\/g, "/")}`,
  });
});

export default router;
