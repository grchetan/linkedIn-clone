const express = require('express');
const {
  createOrUpdateProfile,
  getUserProfileById,
  searchUsers
} = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/profile', authenticate, upload.single('profilePicture'), createOrUpdateProfile);
router.put('/profile', authenticate, upload.single('profilePicture'), createOrUpdateProfile);
router.get('/profile/:id', authenticate, getUserProfileById);
router.get('/search', authenticate, searchUsers);

module.exports = router;
