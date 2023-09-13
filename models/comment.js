const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  message: { type: String, required: true },
  date: { type: Date, default: () => Date.now() },
  author: { type: String, required: true },
});

module.exports = mongoose.model('Comment', CommentSchema);
