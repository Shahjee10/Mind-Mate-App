import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js'; // adjust path if needed

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/avatars';
    // Make sure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use user id + timestamp + extension as filename to avoid conflicts
    const ext = path.extname(file.originalname);
    cb(null, req.user.userId + '-' + Date.now() + ext);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG and PNG files are allowed'), false);
  }
};

export const upload = multer({ storage, fileFilter }).single('avatar');

// Controller method to handle avatar upload
export const uploadAvatar = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ message: err.message });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const userId = req.user.userId;

      // Update user record with avatar path (or URL)
      // Store relative path or URL depending on your setup
      const avatarPath = `/uploads/avatars/${req.file.filename}`;

      // Update user in DB - adjust as per your DB/ORM
      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: avatarPath },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        message: 'Avatar uploaded successfully',
        avatar: avatarPath,
      });
    } catch (error) {
      console.error('Upload avatar error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};
