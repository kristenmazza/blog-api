const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult, checkSchema } = require('express-validator');
const { s3Upload } = require('../services/ImageUpload');

// Show post list
exports.post_list = asyncHandler(async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate('author').exec();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Show full post detail
exports.post_detail = asyncHandler(async (req, res, next) => {
  res.send(res.post);
});

// Delete post
exports.post_delete = asyncHandler(async (req, res, next) => {
  try {
    await res.post.deleteOne();
    res.json({ message: 'Deleted post' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create post
exports.post_create = [
  // Validate and sanitize fields
  body('title', 'Title must not be empty').trim().notEmpty(),
  body('content', 'Post must not be empty').trim().notEmpty(),
  body('published', 'Published status must be indicated').notEmpty(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // If error, send error message(s)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const author = await User.find({}).exec();

    // Create Post object with validated/sanitized data
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      date: Date.now(),
      author: author[0]._id,
      published: req.body.published,
    });

    try {
      // Save post
      const newPost = await post.save();
      res.status(201).json(newPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }),
];

// Update post
exports.post_update = [
  // Validate and sanitize fields
  body('title', 'Title must not be empty').trim().notEmpty(),
  body('content', 'Post must not be empty').trim().notEmpty(),
  body('published', 'Published status must be indicated').notEmpty(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // If error, send error message(s)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const author = await User.find({}).exec();

    // Create Post object with validated/sanitized data
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      date: Date.now(),
      author: author[0]._id,
      published: req.body.published,
      _id: req.params.postId,
    });

    try {
      // Update post to match the new Post object
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        post,
        {}
      );

      res.status(201).json(updatedPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }),
];

// Create image for post
exports.post_image_create = asyncHandler(async (req, res, next) => {
  const image = req.file;
  try {
    const results = await s3Upload(image);

    let update = { uploaded_image: req.file.name };
    const post = await Post.findByIdAndUpdate(req.params.postId, update, {
      new: true,
    });
    console.log(req.file);
    console.log(results);

    return res.json({ success: true, post: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
});

// // Create image for post
// exports.post_image_create = asyncHandler(async (req, res, next) => {
//   singleUpload(req, res, function (err) {
//     if (err) {
//       return res.json({
//         success: false,
//         errors: {
//           title: 'Image Upload Error',
//           detail: err.message,
//           error: err,
//         },
//       });
//     }

//     let update = { uploaded_image: req.file.location };
//     Post.findByIdAndUpdate(req.params.postId, update, { new: true })
//       .then((post) => res.status(200).json({ success: true, post: post }))
//       .catch((err) => res.status(400).json({ success: false, error: err }));
//   });
// });
