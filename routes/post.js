const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const post_controller = require('../controllers/postController');
const Post = require('../models/post');
const mongoose = require('mongoose');

// Get post list
router.get('/', post_controller.post_list);

// Get full post detail
router.get('/:postId', getPost, post_controller.post_detail);

// Create post
router.post('/', post_controller.post_create);

// Delete post
router.delete('/:postId', getPost, post_controller.post_delete);

// Update post
router.put('/edit/:postId', getPost, post_controller.post_update);

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];

  // If bearer exists, split at the space
  const token = bearerHeader && bearerHeader.split(' ')[1];

  // If it does not exist, send error status
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Middleware to find post by ID
async function getPost(req, res, next) {
  let post;
  try {
    if (!mongoose.isValidObjectId(req.params.postId)) {
      return res.status(404).json({ message: 'Cannot find post' });
    }

    post = await Post.findById(req.params.postId);

    if (post === null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.post = post;
  next();
}

module.exports = router;
