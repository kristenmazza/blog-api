const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user');

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: () => Date.now() },
  author: { type: Schema.Types.ObjectId, ref: User, required: true },
  published: { type: Boolean, required: true },
  uploaded_image: { type: String },
  slug: { type: String, unique: true },
});

PostSchema.pre('save', function (next) {
  this.slug = slugify(this.title);
  next();
});

// Slugify blog post title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

module.exports = mongoose.model('Post', PostSchema);
