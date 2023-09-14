const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('../models/post');

const CommentSchema = new Schema({
  message: { type: String, required: true },
  date: { type: Date, default: () => Date.now() },
  author: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: Post, required: true },
});

module.exports = mongoose.model('Comment', CommentSchema);
