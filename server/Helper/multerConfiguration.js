import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      cb(null, "uploads/");
    } catch (error) {
      cb(error, false);
    }
  },
  filename: (req, file, cb) => {
    console.log(req.body);
    const ext = path.extname(file.originalname);
    cb(null, "document_" + Date.now() + ext);
  },
});

const upload = multer({ storage });

export const uploadFields = upload.fields([
  { name: "documentType-0", maxCount: 1 },
  { name: "document-0", maxCount: 1 },
  { name: "documentType-1", maxCount: 1 },
  { name: "document-1", maxCount: 1 },
  { name: "documentType-2", maxCount: 1 },
  { name: "document-2", maxCount: 1 },
  { name: "documentType-3", maxCount: 1 },
  { name: "document-3", maxCount: 1 },
  { name: "documentType-4", maxCount: 1 },
  { name: "document-4", maxCount: 1 },
  { name: "documentType-5", maxCount: 1 },
  { name: "document-5", maxCount: 1 },
  { name: "documentType-6", maxCount: 1 },
  { name: "document-6", maxCount: 1 },
  { name: "documentType-7", maxCount: 1 },
  { name: "document-7", maxCount: 1 },
  { name: "documentType-8", maxCount: 1 },
  { name: "document-8", maxCount: 1 },
]);
