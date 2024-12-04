import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: 'public/images/products', // Simplified destination path
    filename: (req, file, cb) => cb(null, `${(file.originalname)}`) // Unique filename
  });


  export const upload = multer({ storage: storage });