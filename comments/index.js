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
  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[id] = comments;

  await axios
    .post('http://event-bus-srv:4005/events', {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: 'pending',
      },
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

app.post('/events', async (req, res) => {
  console.log('Received event', req.body.type);

  const { type, data } = req.body;
  if (type === 'CommentModerated') {
    // update the status in comments service data
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];

    const commentToBeUpdated = comments.find((comment) => comment.id === id);
    commentToBeUpdated.status = status;

    // notify everyone else that update has happened
    await axios
      .post('http://event-bus-srv:4005/events', {
        type: 'CommentUpdated',
        data,
      })
      .catch((e) =>
        console.log({
          error: e.message,
          data: e.config.data,
          method: e.config.method,
          url: e.config.url,
        })
      );
  }

  res.send({});
  // .end prevents 'socket hang up' axios error on eventBus side
  res.end();
});

app.listen(4001, () => {
  console.log('Comment service: Listening on port 4001');
});
