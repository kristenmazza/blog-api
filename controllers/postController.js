const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');

// Display posts
exports.index = asyncHandler(async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate('author').exec();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.post_detail = asyncHandler(async (req, res, next) => {
  res.send(res.post.title);
});

exports.post_delete = asyncHandler(async (req, res, next) => {
  try {
    await res.post.deleteOne();
    res.json({ message: 'Deleted post' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.post_create = asyncHandler(async (req, res, next) => {
  //   const author = await User.findOne({ username: req.body.username }).exec();
  //   authorId = author._id;

  const author = await User.find({}).exec();

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    date: Date.now(),
    author: author[0]._id,
    published: false,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
