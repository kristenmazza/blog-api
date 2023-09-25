const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const mongoose = require('mongoose');

// Get user
exports.user_detail = asyncHandler(async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res.status(404).json({ message: 'Cannot find user' });
    }

    user = await User.findById(req.params.userId);

    if (user === null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.send(user);
});
