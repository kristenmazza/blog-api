const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user');

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: () => Date.now() },
  author: { type: Schema.Types.ObjectId, ref: User, required: true },
  published: { type: Boolean, default: false },
});

module.exports = mongoose.model('Post', PostSchema);
