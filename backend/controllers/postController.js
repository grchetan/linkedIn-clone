const Post = require('../models/Post');
const Comment = require('../models/Comment');

const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Post text is required.' });
    }

    const post = await Post.create({
      author: req.user.id,
      text,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name profilePicture title');

    return res.status(201).json({
      message: 'Post created successfully.',
      post: populatedPost
    });
  } catch (error) {
    next(error);
  }
};

const getFeed = async (_req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePicture title')
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((post) => post._id);
    const comments = await Comment.find({ post: { $in: postIds } })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: 1 })
      .lean();

    const commentsByPost = comments.reduce((acc, comment) => {
      const key = comment.post.toString();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(comment);
      return acc;
    }, {});

    const feed = posts.map((post) => ({
      ...post,
      comments: commentsByPost[post._id.toString()] || []
    }));

    return res.json(feed);
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: 'postId is required.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const likeIndex = post.likes.findIndex((likeUserId) => likeUserId.toString() === req.user.id);

    if (likeIndex >= 0) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    return res.json({
      message: likeIndex >= 0 ? 'Post unliked.' : 'Post liked.',
      likesCount: post.likes.length,
      isLiked: likeIndex < 0
    });
  } catch (error) {
    next(error);
  }
};

const commentOnPost = async (req, res, next) => {
  try {
    const { postId, text } = req.body;

    if (!postId || !text) {
      return res.status(400).json({ message: 'postId and comment text are required.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user.id,
      text
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name profilePicture');

    return res.status(201).json({
      message: 'Comment added successfully.',
      comment: populatedComment
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: 'postId is required.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own posts.' });
    }

    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(postId);

    return res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getFeed,
  likePost,
  commentOnPost,
  deletePost
};
