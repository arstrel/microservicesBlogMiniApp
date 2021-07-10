const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/events', (req, res) => {
  const event = req.body;
  let errorMessage = '';

  // post service
  axios.post('http://localhost:4000/events', event).catch((e) => {
    errorMessage += e.message;
    console.log({
      error: e.message,
      data: e.config.data,
      method: e.config.method,
      url: e.config.url,
    });
  });

  // comment service
  axios.post('http://localhost:4001/events', event).catch((e) => {
    errorMessage += e.message;
    console.log({
      error: e.message,
      data: e.config.data,
      method: e.config.method,
      url: e.config.url,
    });
  });

  // query service
  axios.post('http://localhost:4002/events', event).catch((e) => {
    console.log({
      error: e.message,
      data: e.config.data,
      method: e.config.method,
      url: e.config.url,
    });
    errorMessage += e.message;
  });

  if (errorMessage) {
    res.send({ status: errorMessage });
  } else {
    res.send({ status: 'OK' });
  }
});

app.listen(4005, () => {
  console.log('Event Bus Listening on 4005');
});