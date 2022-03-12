const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = {
      id,
      title,
      comments: [],
    };
  }

  if (type === 'CommentCreated') {
    const { postId, id, content, status } = data;

    posts[postId].comments.push({
      id,
      content,
      status,
    });
  }

  if (type === 'CommentUpdated') {
    const { postId, id, content, status } = data;
    const index = posts[postId].comments.findIndex(
      (comment) => comment.id === id
    );

    posts[postId].comments[index] = {
      id,
      content,
      status,
    };
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);

  const { type, data } = req.body;

  handleEvent(type, data);

  console.log(posts);

  res.send({});
  // .end prevents 'socket hang up' axios error on eventBus side
  res.end();
});

app.listen(4002, async () => {
  console.log('Query service: Listening on port 4002');

  try {
    // eventBus service
    const res = await axios.get('http://event-bus-srv:4005/events');

    for (let event of res.data) {
      console.log('Processing event:', event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
