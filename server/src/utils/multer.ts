import multer from 'multer';

export const allowedFileTypes = ['.jpg', '.jpeg', '.png', 'image/png', 'image/jpg', 'image/jpeg', 'image/heic'];

// Set up Multer middleware
export const storage = multer.diskStorage({
  destination: 'uploads/',

  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
});
