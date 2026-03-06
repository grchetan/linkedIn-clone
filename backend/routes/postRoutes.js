const express = require('express');
const {
  createPost,
  getFeed,
  likePost,
  commentOnPost,
  deletePost
} = require('../controllers/postController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/create', authenticate, upload.single('image'), createPost);
router.get('/feed', authenticate, getFeed);
router.post('/like', authenticate, likePost);
router.post('/comment', authenticate, commentOnPost);
router.delete('/delete', authenticate, deletePost);

module.exports = router;
