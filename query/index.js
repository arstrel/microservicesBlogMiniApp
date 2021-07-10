const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);

  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = {
      id,
      title,
      comments: [],
    };
  }

  if (type === 'CommentCreated') {
    const { postId, id, content } = data;

    posts[postId].comments.push({
      id,
      content,
    });
  }

  console.log(posts);

  res.send({});
  // .end prevents 'socket hang up' axios error on eventBus side
  res.end();
});

app.listen(4002, () => {
  console.log('Query service: Listening on port 4002');
});
