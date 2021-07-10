const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  await axios
    .post('http://localhost:4005/events', {
      type: 'PostCreated',
      data: { id, title },
    })
    .catch((e) =>
      console.log({
        error: e.message,
        data: e.config.data,
        method: e.config.method,
        url: e.config.url,
      })
    );

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);

  res.send({});
  // .end prevents 'socket hang up' axios error on eventBus side
  res.end();
});

app.listen(4000, () => {
  console.log('Post service: Listening on port 4000');
});
