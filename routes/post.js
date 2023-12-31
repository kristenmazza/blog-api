const express = require('express');
const router = express.Router();
const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');
const Post = require('../models/post');
const Comment = require('../models/comment');
const mongoose = require('mongoose');
const multer = require('multer');
const passport = require('passport');
const { isAdmin } = require('../lib/utils');

// Store file upload in memory
const storage = multer.memoryStorage();

// Filter file upload by type
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000 },
});

// Get post list
router.get('/', post_controller.post_list);

// Get full post detail
router.get('/:slug', getPost, post_controller.post_detail);

// Create post
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  post_controller.post_create
);

// Delete post
router.delete(
  '/:slug',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getPost,
  post_controller.post_delete
);

// Update post
router.put(
  '/:slug',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getPost,
  post_controller.post_update
);

// Update post to include image
router.put(
  '/:slug/image',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.single('uploaded_image'),
  post_controller.put_image_create
);

// Get comments of a post
router.get('/:slug/comments', comment_controller.comment_list);

// Create comment
router.post('/:slug/comments', comment_controller.comment_create);

// Delete comment
router.delete(
  '/:slug/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getComment,
  comment_controller.comment_delete
);

// Middleware to find post by ID
async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findOne({ slug: { $eq: req.params.slug } });

    if (post === null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.post = post;
  next();
}

// Middleware to find commment by ID
async function getComment(req, res, next) {
  let comment;
  try {
    if (!mongoose.isValidObjectId(req.params.commentId)) {
      return res.status(404).json({ message: 'Cannot find comment' });
    }

    comment = await Comment.findById(req.params.commentId);

    if (comment === null) {
      return res.status(404).json({ message: 'Cannot find comment' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.comment = comment;
  next();
}

module.exports = router;
