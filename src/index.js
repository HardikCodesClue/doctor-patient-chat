const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

// Define a basic route
app.get('/', (req, res) => {
  res.send('Welcome to doctor patient chat application');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});