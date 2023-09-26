const asyncHandler = require('express-async-handler');
const Comment = require('../models/comment');
const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

// Show comments of a post
exports.comment_list = asyncHandler(async (req, res, next) => {
  try {
    const currentPost = await Post.findOne({ slug: { $eq: req.params.slug } });

    const comments = await Comment.find({ post: currentPost._id }).exec();

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create comment
exports.comment_create = [
  // Validate and sanitize fields
  body('message', 'Message must not be empty').trim().notEmpty(),
  body('author', 'Author must not be empty').trim().notEmpty(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // If error, send error message(s)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let currentPost;
    try {
      currentPost = await Post.findOne({
        slug: { $eq: req.params.slug },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }

    const comment = new Comment({
      message: req.body.message,
      author: req.body.author,
      post: currentPost._id,
    });

    try {
      // Save comment
      const newComment = await comment.save();
      res.status(201).json(newComment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }),
];

// Delete comment
exports.comment_delete = asyncHandler(async (req, res, next) => {
  try {
    await res.comment.deleteOne();
    res.json({ message: 'Deleted comment' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
