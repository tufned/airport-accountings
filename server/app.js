const express = require('express');
const cors = require('cors');
const tablesRouter = require('./routes/tableRouter');

const app = express();
const corsConfig = {
  origin: 'http://localhost:3007'
}

app.use(cors(corsConfig));
app.use(express.json());

app.use('/table', tablesRouter);


module.exports = app;