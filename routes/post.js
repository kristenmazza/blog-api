const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.posts));
});

router.get('/:postId', (req, res) => {
  return res.send(req.context.models.posts[req.params.postId]);
});

router.put('/edit/:postId', (req, res) => {
  res.json({
    id,
    title: req.body.title,
    content: req.body.text,
    userId: req.context.me.id,
    published: Date.now(),
  });
});

router.post('/', (req, res) => {
  const id = uuidv4();
  const post = {
    id,
    title: req.body.title,
    content: req.body.text,
    userId: req.context.me.id,
    published: Date.now(),
  };

  req.context.models.posts[id] = post;

  return res.send(post);
});

router.delete('/:postId', (req, res) => {
  const { [req.params.postId]: post, ...otherposts } = req.context.models.posts;

  req.context.models.posts = otherposts;

  return res.send(post);
});

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

module.exports = router;
