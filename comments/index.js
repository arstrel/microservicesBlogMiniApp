const { randomBytes } = require('crypto');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const comments = commentsByPostId[id] || [];

  res.send(comments);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { id } = req.params;
  const { content } = req.body;

  const comments = commentsByPostId[id] || [];
  comments.push({ id: commentId, content });

  commentsByPostId[id] = comments;

  await axios
    .post('http://localhost:4005/events', {
      type: 'CommentCreated',
      data: { id: commentId, content, postId: req.params.id },
    })
    .catch((e) =>
      console.log({
        error: e.message,
        data: e.config.data,
        method: e.config.method,
        url: e.config.url,
      })
    );

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);

  res.send({});
  // .end prevents 'socket hang up' axios error on eventBus side
  res.end();
});

app.listen(4001, () => {
  console.log('Comment service: Listening on port 4001');
});
