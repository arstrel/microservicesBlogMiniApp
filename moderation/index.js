const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
  console.log('Received event', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const isApproved = !data.content.includes('orange');
    const newComment = {
      ...data,
      status: isApproved ? 'approved' : 'rejected',
    };

    // eventBus service
    await axios
      .post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: newComment,
      })
      .catch((e) => {
        console.log({
          error: e.message,
          data: e.config.data,
          method: e.config.method,
          url: e.config.url,
        });
      });
  }

  res.send({});
  // .end prevents 'socket hang up' axios error on eventBus side
  res.end();
});

app.listen(4003, () => {
  console.log('Moderation service: Listening on port 4003');
});
