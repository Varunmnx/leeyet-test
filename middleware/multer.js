import multer from "multer";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    let ext = file.originalname.substr(file.originalname.lastIndexOf("."));
    cb(null, file.fieldname+'-'+Date.now()+ext);
  }
});

export const upload = multer({ storage: storage });

